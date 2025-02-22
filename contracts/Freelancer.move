module 0x1::FreelanceEscrow {
    use std::signer;
    use std::vector;
    use std::table;

    struct Milestone has key, store {
        description: vector<u8>,
        amount: u64,
        status: u8,
        paid: bool
    }

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

    struct Escrow has key, store {
        projects: table::Table<u64, Project>,
        project_count: u64
    }

    // Initialize storage
    public entry fun init(account: &signer) {
        let escrow = Escrow {
            projects: table::new<u64, Project>(),
            project_count: 0
        };
        move_to(account, escrow);
    }

    // Create a new project
    public entry fun create_project(
        account: &signer,
        freelancer: address,
        descriptions: vector<vector<u8>>,
        amounts: vector<u64>,
        total_amount: u64
    ) acquires Escrow {
        let escrow = borrow_global_mut<Escrow>(signer::address_of(account));

        assert!(vector::length(&descriptions) == vector::length(&amounts), 100);
        assert!(vector::length(&descriptions) > 0, 101);

        let milestones = vector::empty<Milestone>();
        let len = vector::length(&descriptions);
        let i = 0;
        while (i < len) {
            vector::push_back(
                &mut milestones,
                Milestone {
                    description: *vector::borrow(&descriptions, i),
                    amount: *vector::borrow(&amounts, i),
                    status: 0,
                    paid: false
                }
            );
            i = i + 1;
        };

        table::add(
            &mut escrow.projects,
            escrow.project_count,
            Project {
                client: signer::address_of(account),
                freelancer: freelancer,
                total_amount: total_amount,
                claimed_amount: 0,
                completed_milestones: 0,
                status: 0,
                milestones: milestones,
                is_disputed: false,
                dispute_votes_for_client: 0,
                dispute_votes_for_freelancer: 0
            }
        );
        escrow.project_count = escrow.project_count + 1;
    }

    // Mark milestone as completed
    public entry fun complete_milestone(account: &signer, project_id: u64, milestone_index: u64) acquires Escrow {
        let escrow = borrow_global_mut<Escrow>(signer::address_of(account));
        let project_ref = table::borrow_mut(&mut escrow.projects, project_id);
        assert!(signer::address_of(account) == project_ref.freelancer, 102);
        assert!(project_ref.status == 0, 103);
        assert!(milestone_index < vector::length(&project_ref.milestones), 104);

        let milestone = vector::borrow_mut(&mut project_ref.milestones, milestone_index);
        assert!(milestone.status == 1, 105);
        milestone.status = 2;
        project_ref.completed_milestones = project_ref.completed_milestones + 1;

        if (project_ref.completed_milestones == vector::length(&project_ref.milestones)) {
            project_ref.status = 1;
        }
    }

    // Claim payment (handled externally on Aptos)
    public entry fun claim_payment(account: &signer, project_id: u64) acquires Escrow {
        let escrow = borrow_global_mut<Escrow>(signer::address_of(account));
        let project_ref = table::borrow_mut(&mut escrow.projects, project_id);
        assert!(signer::address_of(account) == project_ref.freelancer, 106);
        assert!(project_ref.completed_milestones > 0, 107);

        let claimable_amount = (project_ref.total_amount * project_ref.completed_milestones) / vector::length(&project_ref.milestones);
        let amount_to_claim = claimable_amount - project_ref.claimed_amount;
        assert!(amount_to_claim > 0, 108);

        project_ref.claimed_amount = claimable_amount;
    }

    // Raise a dispute
    public entry fun raise_dispute(account: &signer, project_id: u64, milestone_index: u64) acquires Escrow {
        let escrow = borrow_global_mut<Escrow>(signer::address_of(account));
        let project_ref = table::borrow_mut(&mut escrow.projects, project_id);
        assert!(signer::address_of(account) == project_ref.client, 109);
        assert!(milestone_index < vector::length(&project_ref.milestones), 110);

        let milestone = vector::borrow_mut(&mut project_ref.milestones, milestone_index);
        assert!(milestone.status == 2, 111);
        milestone.status = 3;
        project_ref.is_disputed = true;
    }

    // Vote on a dispute
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