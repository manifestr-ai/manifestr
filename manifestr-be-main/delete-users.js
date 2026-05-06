/**
 * DELETE USERS SCRIPT (JavaScript version)
 * 
 * This script deletes two specific users from ALL tables
 * 
 * Usage:
 *   node delete-users.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// User IDs to delete
const USER_IDS = [
    'e9ce2f0a-ad00-4039-807c-4e51637f1f73',
    'f07c7cc7-e834-4654-ac69-16cac009e8ee'
];

async function deleteFromTable(tableName, whereColumn = 'user_id') {
    try {
        console.log(`🗑️  Deleting from ${tableName} (${whereColumn})...`);
        const { error, count } = await supabase
            .from(tableName)
            .delete()
            .in(whereColumn, USER_IDS);
        
        if (error) {
            if (error.code === '42P01') {
                console.log(`   ⚠️  Table ${tableName} does not exist, skipping...`);
            } else {
                console.error(`   ❌ Error: ${error.message}`);
            }
        } else {
            console.log(`   ✅ Deleted from ${tableName}`);
        }
    } catch (err) {
        console.error(`   ❌ Exception deleting from ${tableName}:`, err.message);
    }
}

async function deleteUsers() {
    console.log('============================================');
    console.log('🚀 STARTING USER DELETION');
    console.log('============================================');
    console.log('User IDs to delete:');
    USER_IDS.forEach(id => console.log(`  - ${id}`));
    console.log('============================================\n');

    // Delete in order (child tables first)
    
    // 1. Collaboration sessions
    await deleteFromTable('collaboration_sessions', 'user_id');
    
    // 2. Collaboration invites (both as invitee and inviter)
    await deleteFromTable('collaboration_invites', 'invitee_user_id');
    await deleteFromTable('collaboration_invites', 'invited_by');
    
    // 3. Document collaborators (both as member and inviter)
    await deleteFromTable('document_collaborators', 'user_id');
    await deleteFromTable('document_collaborators', 'invited_by');
    
    // 4. Collab project members (both as member and inviter)
    await deleteFromTable('collab_project_members', 'user_id');
    await deleteFromTable('collab_project_members', 'invited_by');
    
    // 5. Update collab project documents (set added_by to NULL)
    console.log('🗑️  Updating collab_project_documents (added_by)...');
    try {
        const { error } = await supabase
            .from('collab_project_documents')
            .update({ added_by: null })
            .in('added_by', USER_IDS);
        
        if (error) {
            console.error(`   ❌ Error: ${error.message}`);
        } else {
            console.log(`   ✅ Updated collab_project_documents`);
        }
    } catch (err) {
        console.error(`   ❌ Exception:`, err.message);
    }
    
    // 6. Delete collab projects owned by users
    await deleteFromTable('collab_projects', 'created_by');
    
    // 7. Delete generation jobs (all content created by users)
    await deleteFromTable('generation_jobs', 'user_id');
    
    // 8. Delete notifications (if exists)
    await deleteFromTable('notifications', 'user_id');
    
    // 9. Delete activity logs (if exists)
    await deleteFromTable('activity_logs', 'user_id');
    
    // 10. Delete user sessions (if exists)
    await deleteFromTable('user_sessions', 'user_id');
    
    // 11. Delete password reset tokens (if exists)
    await deleteFromTable('password_reset_tokens', 'user_id');
    
    // 12. Delete from users table
    await deleteFromTable('users', 'id');
    
    // 13. Delete from Supabase Auth
    console.log('🗑️  Deleting from Supabase Auth (auth.users)...');
    for (const userId of USER_IDS) {
        try {
            const { error } = await supabase.auth.admin.deleteUser(userId);
            if (error) {
                console.error(`   ❌ Error deleting ${userId} from auth: ${error.message}`);
            } else {
                console.log(`   ✅ Deleted ${userId} from Supabase Auth`);
            }
        } catch (err) {
            console.error(`   ❌ Exception deleting ${userId}:`, err.message);
        }
    }
    
    console.log('\n============================================');
    console.log('✅ DELETION COMPLETE!');
    console.log('============================================');
    
    // Verify deletion
    console.log('\n🔍 Verifying deletion...');
    const { data: remainingUsers, error } = await supabase
        .from('users')
        .select('id, email')
        .in('id', USER_IDS);
    
    if (error) {
        console.error('❌ Error verifying:', error.message);
    } else if (remainingUsers && remainingUsers.length > 0) {
        console.log('⚠️  WARNING: Some users still exist in users table:');
        remainingUsers.forEach(user => console.log(`  - ${user.id}: ${user.email}`));
    } else {
        console.log('✅ All users successfully deleted from users table!');
    }
    
    console.log('\n============================================');
    console.log('🏁 SCRIPT FINISHED');
    console.log('============================================\n');
}

// Run the script
deleteUsers()
    .then(() => {
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ FATAL ERROR:', err);
        process.exit(1);
    });
