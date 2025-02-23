module 0xa8b9f1264df1dfebc48397cf1f57cd405b4c2080b9d3ca16a70f20124998f28f::FreelanceEscrow {
    use aptos_framework::coin::{transfer, Coin};
    use aptos_framework::aptos_coin::{AptosCoin};
    use std::signer;
    use std::vector;
    use std::table;

    // A milestone represents a piece of work with a description and a payment amount.
    // status: 0 = not started, 1 = in progress, 2 = completed, 3 = disputed
    struct Milestone has key, store {
        description: vector<u8>,
        amount: u64,
        status: u8,
        paid: bool
    }

    // A project holds multiple milestones along with payment and dispute details.
    // status: 0 = ongoing, 1 = finished
    struct Project has key, store {
        client: address,
        freelancer: address,
        total_amount: u64,
        claimed_amount: u64,
        completed_milestones: u64,
        status: u8,
        milestones: vector<Milestone>,
        is_disputed: bool,
        dispute_votes_for_client: u64,
        dispute_votes_for_freelancer: u64
    }

    // Escrow holds all projects for an account.
    struct Escrow has key, store {
        projects: table::Table<u64, Project>,
        project_count: u64
    }

    // Optional manual initialization; note that create_project now auto-initializes if needed.
    public entry fun init(account: &signer) {
        let escrow = Escrow {
            projects: table::new<u64, Project>(),
            project_count: 0
        };
        move_to(account, escrow);
    }

    // Create a new project. Auto-initializes the Escrow resource for the caller if needed.
    public entry fun create_project(
        account: &signer,
        freelancer: address,
        descriptions: vector<vector<u8>>,
        amounts: vector<u64>,
        total_amount: u64
    ) acquires Escrow {
        let caller = signer::address_of(account);
        // Auto-initialize Escrow if it does not exist on the caller's account.
        if (!exists<Escrow>(caller)) {
            let new_escrow = Escrow {
                projects: table::new<u64, Project>(),
                project_count: 0
            };
            move_to(account, new_escrow);
        };

        let escrow = borrow_global_mut<Escrow>(caller);

        // Validate that the descriptions and amounts arrays match in length and are non-empty.
        assert!(vector::length(&descriptions) == vector::length(&amounts), 100);
        assert!(vector::length(&descriptions) > 0, 101);

        let milestones = vector::empty<Milestone>();
        let len = vector::length(&descriptions);
        let mut i = 0;
        while (i < len) {
            vector::push_back(
                &mut milestones,
                Milestone {
                    description: *vector::borrow(&descriptions, i),
                    amount: *vector::borrow(&amounts, i),
                    status: 0, // not started
                    paid: false
                }
            );
            i = i + 1;
        };

        table::add(
            &mut escrow.projects,
            escrow.project_count,
            Project {
                client: caller,
                freelancer: freelancer,
                total_amount: total_amount,
                claimed_amount: 0,
                completed_milestones: 0,
                status: 0, // ongoing
                milestones: milestones,
                is_disputed: false,
                dispute_votes_for_client: 0,
                dispute_votes_for_freelancer: 0
            }
        );
        escrow.project_count = escrow.project_count + 1;
    }

    // Start a milestone: mark it as "in progress".
    public entry fun start_milestone(account: &signer, project_id: u64, milestone_index: u64) acquires Escrow {
        let escrow = borrow_global_mut<Escrow>(signer::address_of(account));
        let project_ref = table::borrow_mut(&mut escrow.projects, project_id);
        // Only the freelancer can start a milestone.
        assert!(signer::address_of(account) == project_ref.freelancer, 120);
        assert!(milestone_index < vector::length(&project_ref.milestones), 121);
        let milestone = vector::borrow_mut(&mut project_ref.milestones, milestone_index);
        // Milestone must be not started.
        assert!(milestone.status == 0, 122);
        milestone.status = 1; // mark as in progress
    }

    // Complete a milestone and automatically claim its payment.
    public entry fun complete_and_claim_milestone(account: &signer, project_id: u64, milestone_index: u64) acquires Escrow {
        let escrow = borrow_global_mut<Escrow>(signer::address_of(account));
        let project_ref = table::borrow_mut(&mut escrow.projects, project_id);
        // Only the freelancer can complete a milestone.
        assert!(signer::address_of(account) == project_ref.freelancer, 102);
        // Project must be ongoing.
        assert!(project_ref.status == 0, 103);
        assert!(milestone_index < vector::length(&project_ref.milestones), 104);

        let milestone = vector::borrow_mut(&mut project_ref.milestones, milestone_index);
        // Milestone must be in progress to complete.
        assert!(milestone.status == 1, 105);
        milestone.status = 2; // mark as completed
        project_ref.completed_milestones = project_ref.completed_milestones + 1;

        // Automatically claim payment for this milestone if not already claimed.
        if (!milestone.paid) {
            milestone.paid = true;
            project_ref.claimed_amount = project_ref.claimed_amount + milestone.amount;
        };

        // If all milestones are completed, mark the project as finished.
        if (project_ref.completed_milestones == vector::length(&project_ref.milestones)) {
            project_ref.status = 1;
        }
    }

    // Manually claim payment for a specific milestone.
    public entry fun claim_milestone_payment(
        account: &signer, 
        project_id: u64, 
        milestone_index: u64
    ) acquires Escrow {
        let escrow = borrow_global_mut<Escrow>(signer::address_of(account));
        let project_ref = table::borrow_mut(&mut escrow.projects, project_id);
        // Only the freelancer can claim payment for a milestone.
        assert!(signer::address_of(account) == project_ref.freelancer, 130);
        assert!(milestone_index < vector::length(&project_ref.milestones), 131);

        let milestone = vector::borrow_mut(&mut project_ref.milestones, milestone_index);
        // Milestone must be completed and not already claimed.
        assert!(milestone.status == 2, 132);
        assert!(!milestone.paid, 133);

        // Mark the milestone as paid and update the claimed amount.
        milestone.paid = true;
        project_ref.claimed_amount = project_ref.claimed_amount + milestone.amount;

        // Transfer the payment to the freelancer.
        let amount = milestone.amount;
        let client = project_ref.client;
        let freelancer = project_ref.freelancer;

        // Transfer AptosCoin from the client's account to the freelancer.
        transfer<AptosCoin>(client, freelancer, amount);
    }

    // Raise a dispute on a completed milestone.
    public entry fun raise_dispute(account: &signer, project_id: u64, milestone_index: u64) acquires Escrow {
        let escrow = borrow_global_mut<Escrow>(signer::address_of(account));
        let project_ref = table::borrow_mut(&mut escrow.projects, project_id);
        // Only the client can raise a dispute.
        assert!(signer::address_of(account) == project_ref.client, 109);
        assert!(milestone_index < vector::length(&project_ref.milestones), 110);

        let milestone = vector::borrow_mut(&mut project_ref.milestones, milestone_index);
        // The milestone must be completed to raise a dispute.
        assert!(milestone.status == 2, 111);
        milestone.status = 3; // mark as disputed
        project_ref.is_disputed = true;
    }

    // Vote on a dispute.
    public entry fun vote_on_dispute(account: &signer, project_id: u64, vote_for_client: bool) acquires Escrow {
        let escrow = borrow_global_mut<Escrow>(signer::address_of(account));
        let project_ref = table::borrow_mut(&mut escrow.projects, project_id);
        assert!(project_ref.is_disputed, 112);

        if (vote_for_client) {
            project_ref.dispute_votes_for_client = project_ref.dispute_votes_for_client + 1;
        } else {
            project_ref.dispute_votes_for_freelancer = project_ref.dispute_votes_for_freelancer + 1;
        };

        if (project_ref.dispute_votes_for_client + project_ref.dispute_votes_for_freelancer >= 5) {
            project_ref.is_disputed = false;
        }
    }
}
