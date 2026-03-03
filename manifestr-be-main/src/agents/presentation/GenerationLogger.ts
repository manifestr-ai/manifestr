import * as fs from 'fs';
import * as path from 'path';

/**
 * GENERATION LOGGER
 * 
 * Writes all template selection and deck analysis logs to a file
 * instead of console. Each new generation replaces the file.
 */

const logsDir = path.join(__dirname, '../../..', 'generation-logs');
const LATEST_FILE = path.join(logsDir, 'latest.txt');
const CURRENT_JOB_FILE = path.join(logsDir, '.current-job-id');

let currentLogFile: string | null = null;
let logBuffer: string[] = [];

/**
 * Get the current job's log file path
 */
function ensureLogFile(): string {
    if (currentLogFile) return currentLogFile;
    
    // Try to read current job ID from filesystem
    if (fs.existsSync(CURRENT_JOB_FILE)) {
        currentLogFile = LATEST_FILE;
        return currentLogFile;
    }
    
    // Fallback to latest.txt
    currentLogFile = LATEST_FILE;
    return currentLogFile;
}

/**
 * Initialize a new log file for a generation
 */
export function initGenerationLog(jobId: string, topic: string): void {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    
    // Store current job ID for cross-agent access
    fs.writeFileSync(CURRENT_JOB_FILE, jobId, 'utf-8');
    
    // Use latest.txt for easy access
    currentLogFile = LATEST_FILE;
    
    // Clear buffer and start fresh
    logBuffer = [];
    
    // Add header
    const header = `
${'═'.repeat(80)}
    MANIFESTR AI - PRESENTATION GENERATION ANALYSIS
${'═'.repeat(80)}

📋 TOPIC: ${topic}
🆔 JOB ID: ${jobId}
📅 GENERATED: ${new Date().toISOString()}

${'═'.repeat(80)}

`;
    
    logBuffer.push(header);
    
    // Write immediately
    fs.writeFileSync(currentLogFile, header, 'utf-8');
    
    console.log(`\n📝 Generation analysis logging to: generation-logs/latest.txt`);
    console.log(`📋 Topic: ${topic}\n`);
}

/**
 * Append log entry to the current generation log
 */
export function appendLog(content: string): void {
    try {
        const logFile = ensureLogFile();
        
        logBuffer.push(content + '\n');
        
        // Write to file
        fs.appendFileSync(logFile, content + '\n', 'utf-8');
    } catch (err) {
        // Fallback to console if file write fails
        console.log(content);
    }
}

/**
 * Finalize the log and create archive copy
 */
export function finalizeLog(jobId: string): void {
    try {
        const logFile = ensureLogFile();
        const archiveFile = path.join(logsDir, `${jobId}.txt`);
        
        // Copy latest.txt to archive
        if (fs.existsSync(logFile)) {
            const fullLog = fs.readFileSync(logFile, 'utf-8');
            fs.writeFileSync(archiveFile, fullLog, 'utf-8');
        }
        
        appendLog(`\n${'═'.repeat(80)}`);
        appendLog(`✅ Generation analysis complete. Saved to: ${archiveFile}`);
        appendLog(`${'═'.repeat(80)}\n`);
        
        // Clean up current job tracker
        if (fs.existsSync(CURRENT_JOB_FILE)) {
            fs.unlinkSync(CURRENT_JOB_FILE);
        }
        
        console.log(`\n📝 Generation analysis saved to: generation-logs/latest.txt`);
        console.log(`📝 Archive copy saved to: generation-logs/${jobId}.txt\n`);
    } catch (err) {
        console.error('Error finalizing log:', err);
    }
}

/**
 * Get the current log file path
 */
export function getLogFilePath(): string | null {
    return currentLogFile;
}
