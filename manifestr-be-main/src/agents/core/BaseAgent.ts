import SupabaseDB from "../../lib/supabase-db";

export abstract class BaseAgent<TInput, TOutput> {

    constructor() {}

    /**
     * Direct execution method
     */
    async run(job: any): Promise<TOutput> {
        const processingStatus = this.getProcessingStatus();
        console.log(`\n▶ [${processingStatus}] Processing job: ${job.id}`);
        
        // Update status
        await SupabaseDB.updateGenerationJob(job.id, job.user_id, {
            status: processingStatus
        });

        try {
            const input = this.extractInput(job);
            const output = await this.process(input, job);
            
            console.log(`✓ [${processingStatus}] Job ${job.id} step complete`);

            // Save Output to job
            const updateData: any = {
                result: output,
                // Simple progress logic
                progress: processingStatus === 'rendering' ? 100 : 50 
            };

            if ((output as any).title) {
                updateData.title = (output as any).title;
            }
            
            // If rendering, mark completed
            if (processingStatus === 'rendering') {
                updateData.status = 'completed';
                await this.onJobCompleted({ ...job, ...updateData, current_step_data: output });
            }

            await SupabaseDB.updateGenerationJob(job.id, job.user_id, updateData);

            return output;

        } catch (error) {
            console.error(`\n❌ [${processingStatus}] Job ${job.id} FAILED:`);
            console.error(`   Error: ${(error as Error).message}`);
            
            await SupabaseDB.updateGenerationJob(job.id, job.user_id, {
                status: 'failed',
                error: (error as Error).message
            });
            throw error;
        }
    }

    // --- Abstract Methods ---

    /** Which status enum does this agent represent when working? */
    abstract getProcessingStatus(): string;

    /** Extract the correct input type from the job entity */
    abstract extractInput(job: any): TInput;

    /** The core logic */
    abstract process(input: TInput, jobContext: any): Promise<TOutput>;

    /**
     * Optional hook to run when a job reaches the final state in this agent.
     */
    protected async onJobCompleted(job: any): Promise<void> {
        // Override in specific agents if needed
    }
}
