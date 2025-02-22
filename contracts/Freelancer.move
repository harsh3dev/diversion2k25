module 0x1::FreelanceEscrow {

    // Enums for Milestone and Project status
    enum MilestoneStatus {
        NotStarted, InProgress, Completed, Disputed, Resolved
    }

    enum ProjectStatus {
        Active, Completed, Cancelled
    }

    // Structure for Milestone
    struct Milestone has key {
        description: vector<u8>,
        amount: u64,
        status: MilestoneStatus,
        paid: bool
    }

    // Structure for Project
    struct Project has key {
        client: address,
        freelancer: address,
        total_amount: u64,
        claimed_amount: u64,
        completed_milestones: u64,
        status: ProjectStatus,
        milestones: vector<Milestone>,
        is_disputed: bool,
        dispute_votes_for_client: u64,
        dispute_votes_for_freelancer: u64
    }

    // Resource for storing projects
    struct ProjectStore has key {
        projects: table<u64, Project>,
        project_count: u64,
    }

    // Function to initialize a new project
    public fun create_project(
        project_store: &mut ProjectStore,
        client: address,
        freelancer: address,
        milestone_descriptions: vector<vector<u8>>,
        milestone_amounts: vector<u64>
    ) {
        let total_amount = 0u64;
        let new_project = Project {
            client: client,
            freelancer: freelancer,
            total_amount: 0,
            claimed_amount: 0,
            completed_milestones: 0,
            status: ProjectStatus::Active,
            milestones: vector::empty<Milestone>(),
            is_disputed: false,
            dispute_votes_for_client: 0,
            dispute_votes_for_freelancer: 0,
        };

        let length = vector::length<milestone_descriptions>();
        for i in 0..length {
            let milestone = Milestone {
                description: vector::pop_back(milestone_descriptions),
                amount: vector::pop_back(milestone_amounts),
                status: MilestoneStatus::NotStarted,
                paid: false,
            };
            vector::push_back(&mut new_project.milestones, milestone);
        }

        project_store.project_count = project_store.project_count + 1;
        table::add(&mut project_store.projects, project_store.project_count, new_project);
    }

    // Function to start a milestone
    public fun start_milestone(
        project_store: &mut ProjectStore,
        project_id: u64,
        milestone_index: u64
    ) {
        let project = table::borrow_mut(&mut project_store.projects, project_id);
        assert!(project.status == ProjectStatus::Active, 101); // Error if project is not active
        let milestone = &mut project.milestones[milestone_index];
        assert!(milestone.status == MilestoneStatus::NotStarted, 102); // Error if milestone is not in NotStarted status
        milestone.status = MilestoneStatus::InProgress;
    }

    // Function to complete a milestone
    public fun complete_milestone(
        project_store: &mut ProjectStore,
        project_id: u64,
        milestone_index: u64
    ) {
        let project = table::borrow_mut(&mut project_store.projects, project_id);
        assert!(project.status == ProjectStatus::Active, 101);
        let milestone = &mut project.milestones[milestone_index];
        assert!(milestone.status == MilestoneStatus::InProgress, 103);
        milestone.status = MilestoneStatus::Completed;
        project.completed_milestones = project.completed_milestones + 1;

        // Check if all milestones are completed, if so, mark the project as Completed
        if project.completed_milestones == vector::length(&project.milestones) {
            project.status = ProjectStatus::Completed;
        }
    }

    // Claim payment based on completed milestones
    public fun claim_payment(
        project_store: &mut ProjectStore,
        project_id: u64
    ) {
        let project = table::borrow_mut(&mut project_store.projects, project_id);
        assert!(project.completed_milestones > 0, 104);
        assert!(project.claimed_amount < project.total_amount, 105);

        let claimable_amount = project.total_amount * project.completed_milestones / vector::length(&project.milestones);
        let amount_to_claim = claimable_amount - project.claimed_amount;
        assert!(amount_to_claim > 0, 106);

        project.claimed_amount = project.claimed_amount + amount_to_claim;
        // Payment logic (transferring amount to freelancer) would go here
    }

    // Dispute management
    public fun raise_dispute(
        project_store: &mut ProjectStore,
        project_id: u64,
        milestone_index: u64
    ) {
        let project = table::borrow_mut(&mut project_store.projects, project_id);
        let milestone = &mut project.milestones[milestone_index];
        assert!(milestone.status == MilestoneStatus::Completed, 107);
        milestone.status = MilestoneStatus::Disputed;
        project.is_disputed = true;
    }

    // Voting on disputes
    public fun vote_on_dispute(
        project_store: &mut ProjectStore,
        project_id: u64,
        vote_for_client: bool
    ) {
        let project = table::borrow_mut(&mut project_store.projects, project_id);
        assert!(project.is_disputed, 108);

        if vote_for_client {
            project.dispute_votes_for_client = project.dispute_votes_for_client + 1;
        } else {
            project.dispute_votes_for_freelancer = project.dispute_votes_for_freelancer + 1;
        }

        // Resolve the dispute if enough votes are cast
        if project.dispute_votes_for_client + project.dispute_votes_for_freelancer >= 5 {
            project.is_disputed = false;
            let resolved_for_client = project.dispute_votes_for_client > project.dispute_votes_for_freelancer;
            // Resolve milestone and update its status based on the votes
        }
    }
}
