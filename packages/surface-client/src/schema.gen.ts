// Generated from the dac-plane Surface API contract by scripts/contract.ts. Do not edit.

export interface paths {
    "/v1/tenants/{tenant}/tasks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit a task
         * @description With agent_id the task is delegated to that active agent and records the revision current at submission; providers the body omits come from that revision. Delegation to a missing or retired agent is refused with 422, and with 503 until the database is migrated.
         */
        post: operations["submitTask"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/tasks/{task}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read a task */
        get: operations["getTask"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/tasks/{task}/spend-assertions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Complete a spend-governed submission or rework
         * @description If-Match carries the spend challenge version.
         */
        post: operations["assertSpend"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/tasks/{task}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Request cancellation
         * @description If-Match carries the task version.
         */
        post: operations["cancelTask"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/tasks/{task}/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Review a result revision
         * @description If-Match carries the task version.
         */
        post: operations["reviewResult"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/tasks/{task}/attempts/{attempt}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read an attempt of a task */
        get: operations["getAttempt"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/tasks/{task}/revisions/{revision}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read a result revision */
        get: operations["getRevision"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/tasks/{task}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read or stream a task's events */
        get: operations["taskEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/attention": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List open attention requests */
        get: operations["listAttention"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/attention/{attention}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read an attention request */
        get: operations["getAttention"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/attention/{attention}/decisions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Decide an attention request
         * @description If-Match carries the attention request version.
         */
        post: operations["decide"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read or stream the tenant's events */
        get: operations["tenantEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/migration-passes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a migration pass */
        post: operations["createMigrationPass"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/migration-passes/{migration}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read a migration pass */
        get: operations["getMigrationPass"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/migration-passes/{migration}/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Preview a migration pass */
        post: operations["previewMigrationPass"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/migration-passes/{migration}/hold": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Hold a migration pass */
        post: operations["holdMigrationPass"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/migration-passes/{migration}/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Release a held migration pass */
        post: operations["releaseMigrationPass"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/migration-passes/{migration}/execute": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Execute a freshly previewed migration pass */
        post: operations["executeMigrationPass"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/migration-passes/{migration}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancel a migration pass before execution */
        post: operations["cancelMigrationPass"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/authority-grants/{grant}/revoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Revoke a standing authority grant */
        post: operations["revokeAuthorityGrant"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/agents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List agents */
        get: operations["listAgents"];
        put?: never;
        /**
         * Create an agent
         * @description Creates an active agent at revision 1. Its default providers must be registered for the tenant in the runtime and environment roles. Every principal of the tenant reads it; only its creator revises or retires it.
         */
        post: operations["createAgent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/agents/{agent}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read an agent */
        get: operations["getAgent"];
        /**
         * Revise an agent
         * @description Replaces the whole profile as the next revision. Tasks already delegated keep the revision they were delegated to. Only the principal that created the agent revises it, and a retired agent is not revised. If-Match carries the agent version.
         */
        put: operations["reviseAgent"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/agents/{agent}/retire": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Retire an agent
         * @description Stops new delegation to the agent and frees its name. Its revisions and tasks stay readable. Only the principal that created the agent retires it. If-Match carries the agent version.
         */
        post: operations["retireAgent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/agents/{agent}/revisions/{revision}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read an agent revision
         * @description The profile the agent had at one revision, such as the one a task was delegated to.
         */
        get: operations["getAgentRevision"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/connections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List connections */
        get: operations["listConnections"];
        put?: never;
        /**
         * Register a connection
         * @description Registers a connection, owned by the caller, to an account at an external application served by a connector provider registered for the tenant. The response carries the consent URL when the connector answered; the owner opens it and then completes the connection. The surface, the runtime and the model never see the credential.
         */
        post: operations["createConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/connections/{connection}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read a connection */
        get: operations["getConnection"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/connections/{connection}/authorize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Start consent
         * @description Asks the connector for a new consent URL for one of the caller's connections, to finish a first consent or renew one. It changes no record. An Idempotency-Key replays the same URL; use a new key to renew it.
         */
        post: operations["authorizeConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/connections/{connection}/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Complete consent
         * @description Asks the connector whether the owner's consent finished and records the account it reports. A consent not finished is 409 authorization-pending; a failed one is 422 authorization-failed. If-Match carries the connection version.
         */
        post: operations["completeConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/connections/{connection}/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remove a connection
         * @description Revokes every grant of the connection in one transaction, then asks the connector to revoke and destroy the credential. 200 with the removed connection once the connector confirmed; 202 with the connection still removing when it could not be reached, and removing it again repeats the revocation. If-Match carries the connection version.
         */
        post: operations["removeConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/connections/{connection}/tools": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List a connection's tools
         * @description The tools the connection's connector offers now, each the governed action class connector.<name>.
         */
        get: operations["listConnectionTools"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/connections/{connection}/grants": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List a connection's grants */
        get: operations["listConnectionGrants"];
        put?: never;
        /**
         * Grant a connection
         * @description Lets the work of an active agent, or of a task the connection's owner owns, call some of the connection's tools. Only the owner grants. A grant is used only by tasks the owner owns. always approves every call it covers; ask makes each call wait for a decision.
         */
        post: operations["grantConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/connection-grants/{grant}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read a connection grant */
        get: operations["getConnectionGrant"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/connection-grants/{grant}/revoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Revoke a connection grant
         * @description Stops the grant authorizing calls: the next call it covered is refused. Only the principal that granted it revokes it. If-Match carries the grant version.
         */
        post: operations["revokeConnectionGrant"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/tenants/{tenant}/attention/{attention}/connector-call": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Inspect proposed connector call
         * @description Only the task owner may read the exact canonical tool input and digest before deciding. Other actors, including tenant readers, receive 404. The ETag is the attention version for the decision.
         */
        get: operations["getConnectorProposal"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description Opaque record identifier: a canonical lowercase UUIDv7. */
        uuidv7: string;
        /** Format: date-time */
        timestamp: string;
        /** @description What a budget counts; amounts are integers in this unit with no conversion. */
        unit: string;
        /** @description A non-negative budget amount, bounded to 2^53-1 so JSON consumers read it exactly. */
        amount: number;
        /**
         * SubmitTaskRequest
         * @description Body of POST /v1/tenants/{tenant}/tasks. With agent_id the task is delegated to that agent at its current revision, and each provider omitted defaults to that revision's.
         */
        "submit-task-request.schema": {
            agent_id?: components["schemas"]["uuidv7"];
            provider_id?: components["schemas"]["uuidv7"];
            environment_provider_id?: components["schemas"]["uuidv7"];
            objective: string;
            acceptance_criteria: string[];
            /** @enum {unknown} */
            demand?: "person" | "background";
            deadline: components["schemas"]["timestamp"];
            unit: components["schemas"]["unit"];
            ceiling: components["schemas"]["amount"];
            amount: components["schemas"]["amount"];
            spend?: boolean;
        };
        generation: number;
        /** @description The agent revision a task was delegated to, fixed at submission. */
        agentReference: {
            agent_id: components["schemas"]["uuidv7"];
            revision: components["schemas"]["generation"];
        };
        /**
         * Task
         * @description The delegated unit of work a principal owns. rejected (review rejection) is distinct from failed (execution).
         */
        "task.schema": {
            task_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            owner_id: components["schemas"]["uuidv7"];
            objective?: string;
            acceptance_criteria?: string[];
            agent?: components["schemas"]["agentReference"];
            /** @enum {unknown} */
            state: "draft" | "queued" | "running" | "waiting_input" | "verifying" | "ready_for_review" | "cancelling" | "succeeded" | "failed" | "rejected" | "cancelled";
            version: components["schemas"]["generation"];
            created_at: components["schemas"]["timestamp"];
            updated_at: components["schemas"]["timestamp"];
            $defs: {
                /** @enum {unknown} */
                event: "submit" | "dispatch" | "await_input" | "input_resolved" | "input_unresolved" | "propose_result" | "execution_failed" | "retry" | "verification_passed" | "verification_failed" | "accept" | "request_changes" | "reject" | "cancel" | "stop_confirmed";
            };
        };
        /**
         * Attempt
         * @description One execution of a Task. Stop observations are absent until observed and exist only once cancellation is requested; the attempt terminates only after both are observed or reconciled.
         */
        "attempt.schema": {
            attempt_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            task_id: components["schemas"]["uuidv7"];
            environment_provider_id?: components["schemas"]["uuidv7"];
            environment_operation_id?: components["schemas"]["uuidv7"];
            number: number;
            /** @enum {unknown} */
            state: "allocated" | "provisioning" | "starting" | "executing" | "waiting_input" | "finalizing" | "cancellation_requested" | "reconciling" | "migrating" | "migrated" | "completed" | "failed" | "terminated";
            version: components["schemas"]["generation"];
            runtime_stopped?: boolean;
            environment_stopped?: boolean;
            created_at: components["schemas"]["timestamp"];
            updated_at: components["schemas"]["timestamp"];
            $defs: {
                /** @enum {unknown} */
                event: "provision" | "start" | "runtime_started" | "await_input" | "resume" | "finalize" | "complete" | "fail" | "request_cancel" | "runtime_stopped" | "environment_stopped" | "outcome_unknown" | "lease_expired" | "reconciled" | "migrate" | "migration_superseded";
            };
        };
        /**
         * ProviderOperation
         * @description The stable identity of one request to a provider. An uncertain operation is reconciled, never redispatched.
         */
        "provider-operation.schema": {
            operation_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            attempt_id: components["schemas"]["uuidv7"];
            provider_id: components["schemas"]["uuidv7"];
            /** @enum {unknown} */
            state: "recorded" | "dispatched" | "accepted" | "uncertain" | "succeeded" | "failed" | "rejected";
            version: components["schemas"]["generation"];
            created_at: components["schemas"]["timestamp"];
            updated_at: components["schemas"]["timestamp"];
            $defs: {
                /** @enum {unknown} */
                event: "dispatch" | "send_accepted" | "send_rejected" | "send_unknown" | "succeed" | "fail" | "outcome_unknown" | "reconcile";
                /**
                 * @description A provider's report of whether it durably received a request; unknown enters reconciliation.
                 * @enum {unknown}
                 */
                sendStatus: "accepted" | "rejected" | "pending" | "unknown";
            };
        };
        /**
         * Budget
         * @description The authoritative spending limit of one Task in one unit. reserved is the sum of outstanding holds, consumed the sum of recorded usage, and overshoot the largest recorded excess over the ceiling. The Go contract enforces overshoot >= reserved + consumed - ceiling, which needs arithmetic this schema cannot express. An absent count is zero.
         */
        "budget.schema": {
            budget_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            task_id: components["schemas"]["uuidv7"];
            unit: components["schemas"]["unit"];
            ceiling: components["schemas"]["amount"];
            reserved?: components["schemas"]["amount"];
            consumed?: components["schemas"]["amount"];
            overshoot?: components["schemas"]["amount"];
            version: components["schemas"]["generation"];
            updated_at: components["schemas"]["timestamp"];
            $defs: {
                /**
                 * @description Derived, not stored: exhausted once reserved + consumed reaches the ceiling.
                 * @enum {unknown}
                 */
                state: "open" | "exhausted";
            };
        };
        /**
         * Reservation
         * @description Budget held for one Attempt before dispatch. consumed is the cumulative usage reported against it and may exceed amount.
         */
        "reservation.schema": {
            reservation_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            budget_id: components["schemas"]["uuidv7"];
            attempt_id: components["schemas"]["uuidv7"];
            amount: components["schemas"]["amount"];
            consumed: components["schemas"]["amount"];
            /** @enum {unknown} */
            state: "held" | "released";
            version: components["schemas"]["generation"];
            created_at: components["schemas"]["timestamp"];
            updated_at: components["schemas"]["timestamp"];
        };
        /** @description SHA-256 digest of a canonical action input. */
        digest: string;
        /** @description What a principal authorizes in a spend challenge; an assertion must match exactly. */
        spendTerms: {
            tenant_id: components["schemas"]["uuidv7"];
            principal_id: components["schemas"]["uuidv7"];
            task_id: components["schemas"]["uuidv7"];
            attempt_id: components["schemas"]["uuidv7"];
            operation_id: components["schemas"]["uuidv7"];
            amount: components["schemas"]["amount"];
            unit: components["schemas"]["unit"];
            nonce: components["schemas"]["digest"];
        };
        /**
         * SpendChallenge
         * @description First phase of spend authorization. Never reserves or consumes budget. expires_at must be after created_at; the Go contract enforces that.
         */
        "spend-challenge.schema": {
            spend_id: components["schemas"]["uuidv7"];
            terms: components["schemas"]["spendTerms"];
            /** @enum {unknown} */
            state: "pending" | "asserted" | "expired";
            version: components["schemas"]["generation"];
            expires_at: components["schemas"]["timestamp"];
            created_at: components["schemas"]["timestamp"];
            updated_at: components["schemas"]["timestamp"];
        };
        /**
         * SpendReceipt
         * @description Durable evidence of an authorized spend. Records authorization only; it reserves and consumes nothing. proof is the digest of the credential ceremony output.
         */
        "spend-receipt.schema": {
            spend_id: components["schemas"]["uuidv7"];
            terms: components["schemas"]["spendTerms"];
            proof: components["schemas"]["digest"];
            issued_at: components["schemas"]["timestamp"];
        };
        /**
         * Submission
         * @description A submitted task as it stands now.
         */
        "submission.schema": {
            task: components["schemas"]["task.schema"];
            attempt: components["schemas"]["attempt.schema"];
            operation: components["schemas"]["provider-operation.schema"];
            budget: components["schemas"]["budget.schema"];
            reservation: components["schemas"]["reservation.schema"];
            spend_challenge?: components["schemas"]["spend-challenge.schema"];
            spend_receipt?: components["schemas"]["spend-receipt.schema"];
            provider_id: components["schemas"]["uuidv7"];
            environment_provider_id?: components["schemas"]["uuidv7"];
            /** @enum {unknown} */
            harness_mode: "off" | "shadow" | "live";
            /** @enum {unknown} */
            demand: "person" | "background";
            deadline: components["schemas"]["timestamp"];
            unit: components["schemas"]["unit"];
            amount: components["schemas"]["amount"];
            dispatch?: {
                status: string;
                attempts: number;
            };
        };
        /**
         * Problem
         * @description An RFC 9457 problem document. detail never echoes request content.
         */
        "problem.schema": {
            /** Format: uri */
            type: string;
            title: string;
            status: number;
            detail?: string;
        };
        /**
         * @description How the action catalogue partitions an action for authority.
         * @enum {unknown}
         */
        scopeClass: "global" | "setting" | "subject" | "call";
        /** @description The named setting or subject of a setting- or subject-scoped action. */
        target: string;
        scope: {
            class: components["schemas"]["scopeClass"];
            target?: components["schemas"]["target"];
        };
        /**
         * AttentionRequest
         * @description A request for authorized responders to unblock an Attempt. An action approval names the provider, operation and digest of the exact action. policy_generation is the tenant policy the request was raised under; a policy change invalidates decisions on it. expires_at must be after created_at; that comparison is enforced by the Go contract, not expressible here.
         */
        "attention-request.schema": {
            scope?: components["schemas"]["scope"];
            attention_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            task_id: components["schemas"]["uuidv7"];
            attempt_id: components["schemas"]["uuidv7"];
            /** @enum {unknown} */
            kind: "question" | "action_approval" | "authentication_handoff" | "blocked_work";
            provider_id?: components["schemas"]["uuidv7"];
            operation_id?: components["schemas"]["uuidv7"];
            action_digest?: components["schemas"]["digest"];
            policy_generation: components["schemas"]["generation"];
            responders: components["schemas"]["uuidv7"][];
            /** @enum {unknown} */
            state: "pending" | "decided" | "dispatching" | "delivered" | "consumed" | "expired" | "cancelled" | "superseded";
            version: components["schemas"]["generation"];
            decision_id?: components["schemas"]["uuidv7"];
            expires_at: components["schemas"]["timestamp"];
            created_at: components["schemas"]["timestamp"];
            updated_at: components["schemas"]["timestamp"];
            $defs: {
                /** @enum {unknown} */
                event: "decide" | "dispatch" | "redeliver" | "deliver" | "consume" | "expire" | "cancel" | "supersede";
            };
        } & (unknown & unknown & unknown);
        /**
         * ResultRevision
         * @description One immutable proposed result of a Task, made of committed artifacts. Rework creates a new revision naming its predecessor; only the first revision has none.
         */
        "result-revision.schema": {
            revision_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            task_id: components["schemas"]["uuidv7"];
            attempt_id: components["schemas"]["uuidv7"];
            number: number;
            previous_revision_id?: components["schemas"]["uuidv7"];
            artifact_ids: components["schemas"]["uuidv7"][];
            verification_ids?: components["schemas"]["uuidv7"][];
            created_at: components["schemas"]["timestamp"];
        };
        /**
         * ResultReview
         * @description An append-only judgement of one exact revision by one principal, made on the task version the reviewer saw. Concurrent reviews conflict on that version.
         */
        "result-review.schema": {
            review_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            task_id: components["schemas"]["uuidv7"];
            revision_id: components["schemas"]["uuidv7"];
            reviewer_id: components["schemas"]["uuidv7"];
            /** @enum {unknown} */
            disposition: "accept" | "request_changes" | "reject";
            task_version: components["schemas"]["generation"];
            reviewed_at: components["schemas"]["timestamp"];
        };
        /**
         * RevisionView
         * @description One result revision and the reviews it received.
         */
        "revision-view.schema": {
            revision: components["schemas"]["result-revision.schema"];
            reviews: components["schemas"]["result-review.schema"][];
        };
        /**
         * TaskView
         * @description A task as a surface reads it. The ETag header carries task.version.
         */
        "task-view.schema": {
            task: components["schemas"]["task.schema"];
            attempt?: components["schemas"]["attempt.schema"];
            open_attention: components["schemas"]["attention-request.schema"][];
            spend_challenge?: components["schemas"]["spend-challenge.schema"];
            revisions: components["schemas"]["revision-view.schema"][];
        };
        /**
         * SpendAssertionRequest
         * @description Body of POST .../tasks/{task}/spend-assertions. Exactly one of submission_key and review_key names the governed command by its Idempotency-Key.
         */
        "spend-assertion-request.schema": {
            submission_key?: string;
            review_key?: string;
            assertion: {
                spend_id: components["schemas"]["uuidv7"];
                terms: components["schemas"]["spendTerms"];
                proof: components["schemas"]["digest"];
                asserted_at: components["schemas"]["timestamp"];
            };
        };
        /**
         * CancelRequest
         * @description Body of POST .../tasks/{task}/cancel; the task version travels in If-Match.
         */
        "cancel-request.schema": Record<string, never>;
        /**
         * CancelResult
         * @description Result of a cancellation request; the stop is confirmed by later events.
         */
        "cancel-result.schema": {
            task_id: components["schemas"]["uuidv7"];
            state: string;
            attempt_id?: components["schemas"]["uuidv7"];
            attempt_state?: string;
            reason?: string;
        };
        /**
         * ReviewRequest
         * @description Body of POST .../tasks/{task}/reviews.
         */
        "review-request.schema": {
            revision_id: components["schemas"]["uuidv7"];
            /** @enum {unknown} */
            disposition: "accept" | "request_changes" | "reject";
            rework?: {
                provider_id: components["schemas"]["uuidv7"];
                environment_provider_id: components["schemas"]["uuidv7"];
                /** @enum {unknown} */
                demand: "person" | "background";
                deadline: components["schemas"]["timestamp"];
                unit: components["schemas"]["unit"];
                amount: components["schemas"]["amount"];
                spend?: boolean;
            };
        };
        /**
         * ReviewResult
         * @description Result of a review; rework is present when changes were requested and new work was scheduled.
         */
        "review-result.schema": {
            review: components["schemas"]["result-review.schema"];
            rework?: components["schemas"]["submission.schema"];
        };
        /** @description Opaque, resumable position in one stream: a cursor from another stream or tenant is reset. */
        cursor: string;
        /**
         * Event
         * @description One committed lifecycle event. record_version is the record's own gapless revision.
         */
        "event.schema": {
            cursor: components["schemas"]["cursor"];
            task_id?: components["schemas"]["uuidv7"];
            /** @enum {unknown} */
            record_kind: "task" | "attempt" | "attention_request" | "provider_operation" | "harness_qualification" | "migration_pass" | "maintenance_claim" | "budget" | "reservation" | "spend_challenge" | "artifact" | "authority_use" | "authority_grant" | "agent" | "connection" | "connection_grant";
            record_id: components["schemas"]["uuidv7"];
            record_version: number;
            event: string;
            from_state: string;
            to_state?: string;
            occurred_at: components["schemas"]["timestamp"];
            $defs: {
                /** @description Opaque, resumable position in one stream: a cursor from another stream or tenant is reset. */
                cursor: string;
            };
        };
        /**
         * EventPage
         * @description One page of events. When reset is true the cursor could not be resumed: re-read snapshots and continue from next_cursor.
         */
        "event-page.schema": {
            events: components["schemas"]["event.schema"][];
            next_cursor: components["schemas"]["cursor"];
            reset: boolean;
        };
        /**
         * AttentionList
         * @description Open attention requests on tasks the principal may read.
         */
        "attention-list.schema": {
            attention: components["schemas"]["attention-request.schema"][];
        };
        /**
         * DecisionRequest
         * @description Body of POST .../attention/{attention}/decisions.
         */
        "decision-request.schema": {
            /** @enum {unknown} */
            kind: "approve_once" | "approve_standing" | "deny" | "answer";
            answer_digest?: components["schemas"]["digest"];
        };
        /**
         * DecisionResult
         * @description Result of a decision.
         */
        "decision-result.schema": {
            attention_id: components["schemas"]["uuidv7"];
            decision_id: components["schemas"]["uuidv7"];
            /** @enum {unknown} */
            kind: "approve_once" | "approve_standing" | "deny" | "answer";
            state: string;
            grant_id?: components["schemas"]["uuidv7"];
        };
        /**
         * CreateMigrationRequest
         * @description Body of POST /v1/tenants/{tenant}/migration-passes. The providers must differ; the Go contract enforces that comparison.
         */
        "create-migration-request.schema": {
            from_provider_id: components["schemas"]["uuidv7"];
            to_provider_id: components["schemas"]["uuidv7"];
        };
        /**
         * MigrationPass
         * @description Moves a tenant's work between runtime harnesses. Execution follows a fresh preview and is a separate principal command. from_provider_id and to_provider_id must differ; the Go contract enforces that.
         */
        "migration-pass.schema": {
            migration_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            from_provider_id: components["schemas"]["uuidv7"];
            to_provider_id: components["schemas"]["uuidv7"];
            /** @enum {unknown} */
            state: "planned" | "previewed" | "held" | "executing" | "completed" | "failed" | "cancelled";
            version: components["schemas"]["generation"];
            created_at: components["schemas"]["timestamp"];
            updated_at: components["schemas"]["timestamp"];
            $defs: {
                /** @enum {unknown} */
                event: "preview" | "hold" | "release" | "execute" | "complete" | "fail" | "cancel";
            };
        };
        /**
         * MigrationPreview
         * @description The harness qualification versions and server time captured by a migration preview.
         */
        "migration-preview.schema": {
            from_version: components["schemas"]["generation"];
            to_version: components["schemas"]["generation"];
            previewed_at: components["schemas"]["timestamp"];
        };
        /**
         * MigrationView
         * @description A migration pass as an administrator reads it. The ETag header carries migration.version.
         */
        "migration-view.schema": {
            migration: components["schemas"]["migration-pass.schema"];
            preview?: components["schemas"]["migration-preview.schema"];
        };
        /**
         * EmptyCommandRequest
         * @description Body of an administrative command whose resource and version travel in the path and headers.
         */
        "empty-command-request.schema": Record<string, never>;
        /** @description An agent's display name: one line with no surrounding space, unique among a tenant's active agents. */
        agentName: string;
        /** @description What the agent is for, in the tenant's words. */
        agentRole: string;
        /** @description Standing instructions delivered to the runtime beside each task's brief. */
        agentInstructions: string;
        /**
         * Agent
         * @description What a tenant delegates work to: a named role with standing instructions and default providers. Not a principal; a task delegated to it is owned and authorised by the principal that submitted it. It holds no model identifier, credential or tool list.
         */
        "agent.schema": {
            agent_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            created_by: components["schemas"]["uuidv7"];
            name: components["schemas"]["agentName"];
            role: components["schemas"]["agentRole"];
            instructions?: components["schemas"]["agentInstructions"];
            provider_id: components["schemas"]["uuidv7"];
            environment_provider_id: components["schemas"]["uuidv7"];
            revision: components["schemas"]["generation"];
            /** @enum {unknown} */
            state: "active" | "retired";
            version: components["schemas"]["generation"];
            created_at: components["schemas"]["timestamp"];
            updated_at: components["schemas"]["timestamp"];
            $defs: {
                /** @enum {unknown} */
                event: "revise" | "retire";
            };
        };
        /**
         * AgentList
         * @description The tenant's agents, retired ones included, oldest first.
         */
        "agent-list.schema": {
            agents: components["schemas"]["agent.schema"][];
        };
        /**
         * AgentRequest
         * @description Body of POST /v1/tenants/{tenant}/agents and PUT /v1/tenants/{tenant}/agents/{agent}: the agent's whole profile. A revision replaces it as a whole. It holds no model identifier, credential or tool list.
         */
        "agent-request.schema": {
            name: components["schemas"]["agentName"];
            role: components["schemas"]["agentRole"];
            instructions?: components["schemas"]["agentInstructions"];
            provider_id: components["schemas"]["uuidv7"];
            environment_provider_id: components["schemas"]["uuidv7"];
        };
        /**
         * Agent revision
         * @description The immutable profile an agent had at one revision. Tasks refer to it, so it outlives later revisions and the agent's retirement.
         */
        "agent-revision.schema": {
            tenant_id: components["schemas"]["uuidv7"];
            agent_id: components["schemas"]["uuidv7"];
            revision: components["schemas"]["generation"];
            name: components["schemas"]["agentName"];
            role: components["schemas"]["agentRole"];
            instructions?: components["schemas"]["agentInstructions"];
            provider_id: components["schemas"]["uuidv7"];
            environment_provider_id: components["schemas"]["uuidv7"];
            created_by: components["schemas"]["uuidv7"];
            created_at: components["schemas"]["timestamp"];
        };
        /** @description What the external application reported about the account a connection acts as. It holds no credential. */
        connectionAccount: {
            account: string;
            permissions: string[];
        };
        /**
         * Connection
         * @description A tenant's link to one account at an external application, served by a connector provider. It refers to a credential the connector adapter holds and holds no secret. Only its owner completes, grants or removes it.
         */
        "connection.schema": {
            connection_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            provider_id: components["schemas"]["uuidv7"];
            owner: components["schemas"]["uuidv7"];
            name: string;
            /** @enum {unknown} */
            state: "authorizing" | "active" | "removing" | "removed";
            account?: components["schemas"]["connectionAccount"];
            version: components["schemas"]["generation"];
            created_at: components["schemas"]["timestamp"];
            updated_at: components["schemas"]["timestamp"];
            $defs: {
                /** @enum {unknown} */
                event: "complete" | "remove" | "finish_removal";
            };
        };
        /**
         * ConnectionList
         * @description The tenant's connections, removed ones included, oldest first.
         */
        "connection-list.schema": {
            connections: components["schemas"]["connection.schema"][];
        };
        /**
         * ConnectionRequest
         * @description Body of POST /v1/tenants/{tenant}/connections: the connector provider that serves the connection and its owner's name for it. Nothing in it can carry a credential; consent happens at the connector.
         */
        "connection-request.schema": {
            provider_id: components["schemas"]["uuidv7"];
            name: string;
        };
        /**
         * AuthorizationStarted
         * @description A connector's reply to begin_authorization: the URL the connection's owner opens to consent. HTTPS, or HTTP on a loopback host for local development; the Go contract enforces the host rule.
         */
        "authorization-started.schema": {
            /** Format: uri */
            authorization_url: string;
            expires_at: components["schemas"]["timestamp"];
        };
        /**
         * ConnectionCreated
         * @description The created connection and, when its connector answered, the URL the owner opens to consent.
         */
        "connection-created.schema": {
            connection: components["schemas"]["connection.schema"];
            authorization?: components["schemas"]["authorization-started.schema"];
        };
        /**
         * CompleteConnectionRequest
         * @description The confirmation proof received by the callback browser after consent.
         */
        "complete-connection-request.schema": {
            confirmation: string;
        };
        /** @description A connector tool's name: one segment of the governed action class connector.<name>. */
        toolName: string;
        tool: {
            name: components["schemas"]["toolName"];
            description: string;
            input_schema: {
                /** @constant */
                type: "object";
            };
            read_only?: boolean;
        };
        /**
         * ToolCatalogue
         * @description A connector's reply to list_tools: the tools it offers, each a governed action class connector.<name>. Tool names are distinct.
         */
        "tool-catalogue.schema": {
            tools: components["schemas"]["tool"][];
            $defs: {
                tool: {
                    name: components["schemas"]["toolName"];
                    description: string;
                    input_schema: {
                        /** @constant */
                        type: "object";
                    };
                    read_only?: boolean;
                };
            };
        };
        /**
         * ConnectionGrant
         * @description Lets the work of one agent, or of one task, call some tools of a connection. Used only by a task the connection's owner owns. always is the owner's standing approval of every call it covers; ask makes each call wait for a decision. call_limit bounds the calls one task may make under the grant.
         */
        "connection-grant.schema": {
            grant_id: components["schemas"]["uuidv7"];
            tenant_id: components["schemas"]["uuidv7"];
            connection_id: components["schemas"]["uuidv7"];
            agent_id?: components["schemas"]["uuidv7"];
            task_id?: components["schemas"]["uuidv7"];
            tools: components["schemas"]["toolName"][];
            /** @enum {unknown} */
            permission: "ask" | "always";
            call_limit: number;
            /** @enum {unknown} */
            state: "active" | "revoked";
            granted_by: components["schemas"]["uuidv7"];
            version: components["schemas"]["generation"];
            expires_at: components["schemas"]["timestamp"];
            created_at: components["schemas"]["timestamp"];
            updated_at: components["schemas"]["timestamp"];
            $defs: {
                /** @enum {unknown} */
                event: "revoke";
            };
        };
        /**
         * ConnectionGrantList
         * @description A connection's grants, revoked ones included, oldest first.
         */
        "connection-grant-list.schema": {
            grants: components["schemas"]["connection-grant.schema"][];
        };
        /**
         * ConnectionGrantRequest
         * @description Body of POST /v1/tenants/{tenant}/connections/{connection}/grants. Names exactly one of an agent and a task; the tools must be ones the connector offers.
         */
        "connection-grant-request.schema": {
            agent_id?: components["schemas"]["uuidv7"];
            task_id?: components["schemas"]["uuidv7"];
            tools: components["schemas"]["toolName"][];
            /** @enum {unknown} */
            permission: "ask" | "always";
            call_limit: number;
            expires_at: components["schemas"]["timestamp"];
        };
        /**
         * ConnectorProposal
         * @description Owner-only exact proposed tool arguments, bound to an attention request and its decision version.
         */
        "connector-proposal.schema": {
            attention_id: components["schemas"]["uuidv7"];
            operation_id: components["schemas"]["uuidv7"];
            connection_id: components["schemas"]["uuidv7"];
            attention_version: number;
            tool: string;
            input: Record<string, never>;
            input_digest: components["schemas"]["digest"];
        };
    };
    responses: {
        /** @description Not available until the database is migrated: the binary serves an earlier schema during a rollout (ADR-0011). Retry after the migration. */
        Problem503: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["problem.schema"];
            };
        };
        /** @description The updated migration pass and its current preview evidence, when present. */
        MigrationView: {
            headers: {
                ETag: components["headers"]["ETag"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["migration-view.schema"];
            };
        };
        /** @description Malformed request */
        Problem400: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["problem.schema"];
            };
        };
        /** @description Unauthenticated */
        Problem401: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["problem.schema"];
            };
        };
        /** @description Forbidden */
        Problem403: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["problem.schema"];
            };
        };
        /** @description Not found, or not visible to the principal */
        Problem404: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["problem.schema"];
            };
        };
        /** @description Refused by the lifecycle */
        Problem409: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["problem.schema"];
            };
        };
        /** @description Stale If-Match version */
        Problem412: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["problem.schema"];
            };
        };
        /** @description Invalid command, or Idempotency-Key reused with a different body */
        Problem422: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["problem.schema"];
            };
        };
        /** @description If-Match required */
        Problem428: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["problem.schema"];
            };
        };
        /** @description Internal error */
        Problem500: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["problem.schema"];
            };
        };
    };
    parameters: {
        /** @description The agent. */
        Agent: components["schemas"]["uuidv7"];
        /** @description The agent revision number, from 1. */
        AgentRevision: number;
        /** @description The tenant; the bearer identity must be bound to a principal of it. */
        Tenant: components["schemas"]["uuidv7"];
        /** @description The task. */
        Task: components["schemas"]["uuidv7"];
        /** @description The attempt. */
        Attempt: components["schemas"]["uuidv7"];
        /** @description The result revision. */
        Revision: components["schemas"]["uuidv7"];
        /** @description The attention request. */
        Attention: components["schemas"]["uuidv7"];
        /** @description The migration pass. */
        Migration: components["schemas"]["uuidv7"];
        /** @description The authority grant. */
        Grant: components["schemas"]["uuidv7"];
        /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
        IdempotencyKey: string;
        /** @description The strong ETag of the record version the command was decided on. */
        IfMatch: string;
        /** @description Resume after this cursor; Last-Event-ID takes precedence. */
        After: components["schemas"]["cursor"];
        /** @description SSE resume cursor. A malformed or foreign cursor is answered with a reset. */
        LastEventID: string;
        /** @description Page size, 1 to 500; default 100. */
        Limit: number;
        /** @description Connection identifier. */
        Connection: components["schemas"]["uuidv7"];
        /** @description Connection grant identifier. */
        ConnectionGrant: components["schemas"]["uuidv7"];
    };
    requestBodies: {
        EmptyCommand: {
            content: {
                "application/json": components["schemas"]["empty-command-request.schema"];
            };
        };
    };
    headers: {
        /** @description Strong entity tag carrying the record version. */
        ETag: string;
    };
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    submitTask: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["submit-task-request.schema"];
            };
        };
        responses: {
            /** @description The submission. Replaying the same Idempotency-Key and body returns it again. */
            201: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    /** @description URL of the created task. */
                    Location?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["submission.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            422: components["responses"]["Problem422"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getTask: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The task. */
                task: components["parameters"]["Task"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The task. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["task-view.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
        };
    };
    assertSpend: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The task. */
                task: components["parameters"]["Task"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["spend-assertion-request.schema"];
            };
        };
        responses: {
            /** @description The submission with its receipt and dispatch. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["submission.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
        };
    };
    cancelTask: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The task. */
                task: components["parameters"]["Task"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["cancel-request.schema"];
            };
        };
        responses: {
            /** @description Cancellation recorded; the stop is confirmed by later events. */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["cancel-result.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
        };
    };
    reviewResult: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The task. */
                task: components["parameters"]["Task"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["review-request.schema"];
            };
        };
        responses: {
            /** @description The review, with rework when changes were requested. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["review-result.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
        };
    };
    getAttempt: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The task. */
                task: components["parameters"]["Task"];
                /** @description The attempt. */
                attempt: components["parameters"]["Attempt"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The attempt. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["attempt.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
        };
    };
    getRevision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The task. */
                task: components["parameters"]["Task"];
                /** @description The result revision. */
                revision: components["parameters"]["Revision"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The revision and its reviews. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["revision-view.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
        };
    };
    taskEvents: {
        parameters: {
            query?: {
                /** @description Resume after this cursor; Last-Event-ID takes precedence. */
                after?: components["parameters"]["After"];
                /** @description Page size, 1 to 500; default 100. */
                limit?: components["parameters"]["Limit"];
            };
            header?: {
                /** @description SSE resume cursor. A malformed or foreign cursor is answered with a reset. */
                "Last-Event-ID"?: components["parameters"]["LastEventID"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The task. */
                task: components["parameters"]["Task"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of events (application/json) or a Server-Sent Events stream (text/event-stream) whose ids are cursors; a reset event carries next_cursor. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["event-page.schema"];
                    "text/event-stream": string;
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            422: components["responses"]["Problem422"];
            500: components["responses"]["Problem500"];
        };
    };
    listAttention: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Open requests on tasks the principal may read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["attention-list.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            500: components["responses"]["Problem500"];
        };
    };
    getAttention: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The attention request. */
                attention: components["parameters"]["Attention"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The request. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["attention-request.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
        };
    };
    decide: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The attention request. */
                attention: components["parameters"]["Attention"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["decision-request.schema"];
            };
        };
        responses: {
            /** @description The recorded decision. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["decision-result.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
        };
    };
    tenantEvents: {
        parameters: {
            query?: {
                /** @description Resume after this cursor; Last-Event-ID takes precedence. */
                after?: components["parameters"]["After"];
                /** @description Page size, 1 to 500; default 100. */
                limit?: components["parameters"]["Limit"];
            };
            header?: {
                /** @description SSE resume cursor. A malformed or foreign cursor is answered with a reset. */
                "Last-Event-ID"?: components["parameters"]["LastEventID"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of events (application/json) or a Server-Sent Events stream (text/event-stream) whose ids are cursors; a reset event carries next_cursor. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["event-page.schema"];
                    "text/event-stream": string;
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            422: components["responses"]["Problem422"];
            500: components["responses"]["Problem500"];
        };
    };
    createMigrationPass: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["create-migration-request.schema"];
            };
        };
        responses: {
            /** @description The migration pass. Replaying the same Idempotency-Key and body returns it again. */
            201: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    /** @description URL of the created migration pass. */
                    Location?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["migration-view.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            422: components["responses"]["Problem422"];
            500: components["responses"]["Problem500"];
        };
    };
    getMigrationPass: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The migration pass. */
                migration: components["parameters"]["Migration"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The migration pass and its current preview evidence, when present. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["migration-view.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
        };
    };
    previewMigrationPass: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The migration pass. */
                migration: components["parameters"]["Migration"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["EmptyCommand"];
        responses: {
            200: components["responses"]["MigrationView"];
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
        };
    };
    holdMigrationPass: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The migration pass. */
                migration: components["parameters"]["Migration"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["EmptyCommand"];
        responses: {
            200: components["responses"]["MigrationView"];
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
        };
    };
    releaseMigrationPass: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The migration pass. */
                migration: components["parameters"]["Migration"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["EmptyCommand"];
        responses: {
            200: components["responses"]["MigrationView"];
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
        };
    };
    executeMigrationPass: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The migration pass. */
                migration: components["parameters"]["Migration"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["EmptyCommand"];
        responses: {
            202: components["responses"]["MigrationView"];
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
        };
    };
    cancelMigrationPass: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The migration pass. */
                migration: components["parameters"]["Migration"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["EmptyCommand"];
        responses: {
            200: components["responses"]["MigrationView"];
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
        };
    };
    revokeAuthorityGrant: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The authority grant. */
                grant: components["parameters"]["Grant"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["EmptyCommand"];
        responses: {
            /** @description The authority grant is revoked. An exact replay has the same result. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            422: components["responses"]["Problem422"];
            500: components["responses"]["Problem500"];
        };
    };
    listAgents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The tenant's agents, retired ones included, oldest first. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["agent-list.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            500: components["responses"]["Problem500"];
        };
    };
    createAgent: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["agent-request.schema"];
            };
        };
        responses: {
            /** @description The agent. Replaying the same Idempotency-Key and body returns it again. */
            201: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    /** @description URL of the created agent. */
                    Location?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["agent.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            409: components["responses"]["Problem409"];
            422: components["responses"]["Problem422"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getAgent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The agent. */
                agent: components["parameters"]["Agent"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The agent at its current revision. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["agent.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
        };
    };
    reviseAgent: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The agent. */
                agent: components["parameters"]["Agent"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["agent-request.schema"];
            };
        };
        responses: {
            /** @description The agent at its new revision. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["agent.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    retireAgent: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The agent. */
                agent: components["parameters"]["Agent"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["EmptyCommand"];
        responses: {
            /** @description The retired agent. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["agent.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getAgentRevision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The agent. */
                agent: components["parameters"]["Agent"];
                /** @description The agent revision number, from 1. */
                revision: components["parameters"]["AgentRevision"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The revision. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["agent-revision.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
        };
    };
    listConnections: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The tenant's connections. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["connection-list.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            500: components["responses"]["Problem500"];
        };
    };
    createConnection: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["connection-request.schema"];
            };
        };
        responses: {
            /** @description The connection, authorizing, and its consent URL. Replaying the same Idempotency-Key and body returns the connection again with a new URL. */
            201: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    /** @description URL of the created connection. */
                    Location?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["connection-created.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            409: components["responses"]["Problem409"];
            422: components["responses"]["Problem422"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getConnection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description Connection identifier. */
                connection: components["parameters"]["Connection"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The connection. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["connection.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
        };
    };
    authorizeConnection: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description Connection identifier. */
                connection: components["parameters"]["Connection"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["EmptyCommand"];
        responses: {
            /** @description The consent URL and its expiry. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["authorization-started.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    completeConnection: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description Connection identifier. */
                connection: components["parameters"]["Connection"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["complete-connection-request.schema"];
            };
        };
        responses: {
            /** @description The active connection. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["connection.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    removeConnection: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description Connection identifier. */
                connection: components["parameters"]["Connection"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["EmptyCommand"];
        responses: {
            /** @description The removed connection. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["connection.schema"];
                };
            };
            /** @description The connection, removing: its credential is not yet revoked at the connector. */
            202: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["connection.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listConnectionTools: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description Connection identifier. */
                connection: components["parameters"]["Connection"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The connector's tool catalogue. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["tool-catalogue.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listConnectionGrants: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description Connection identifier. */
                connection: components["parameters"]["Connection"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The connection's grants. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["connection-grant-list.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
        };
    };
    grantConnection: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description Connection identifier. */
                connection: components["parameters"]["Connection"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["connection-grant-request.schema"];
            };
        };
        responses: {
            /** @description The grant. Replaying the same Idempotency-Key and body returns it again. */
            201: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    /** @description URL of the created grant. */
                    Location?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["connection-grant.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            422: components["responses"]["Problem422"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getConnectionGrant: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description Connection grant identifier. */
                grant: components["parameters"]["ConnectionGrant"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The grant. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["connection-grant.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
        };
    };
    revokeConnectionGrant: {
        parameters: {
            query?: never;
            header: {
                /** @description Client-chosen key, 1 to 128 bytes; the command nonce. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                /** @description The strong ETag of the record version the command was decided on. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description Connection grant identifier. */
                grant: components["parameters"]["ConnectionGrant"];
            };
            cookie?: never;
        };
        requestBody: components["requestBodies"]["EmptyCommand"];
        responses: {
            /** @description The revoked grant. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["connection-grant.schema"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getConnectorProposal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The tenant; the bearer identity must be bound to a principal of it. */
                tenant: components["parameters"]["Tenant"];
                /** @description The attention request. */
                attention: components["parameters"]["Attention"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The immutable proposed call. */
            200: {
                headers: {
                    ETag: components["headers"]["ETag"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["connector-proposal.schema"];
                };
            };
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            500: components["responses"]["Problem500"];
        };
    };
}
