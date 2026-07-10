function processActivity(activity){
    const type = activity.type;
    const displayName = activity.actor.display_login;
    const repoName = activity.repo.name;
    switch(activity.type){
        case 'CreateEvent':
            console.log(`${displayName} created a ${activity.payload.ref_type} named ${activity.payload.ref} on repository ${repoName}`);
            return;
        break;
        case 'DeleteEvent':
            console.log(`${displayName} deleted a ${activity.payload.ref_type} named ${ref} on repository ${repoName}`);
            break;
        case 'DiscussionEvent':
            console.log(`${displayName} started a discussion on repository ${repoName}.\nMore details`, activity.payload.action, activity.payload.discussion);
            break;
        case 'ForkEvent':
            console.log(`${displayName} forked ${repoName} whose owner is ${repoName.split('/')[0]}`);
            break;
        default: 
        console.log(`The activity is not yet included`);
    }   
}
async function main(){ 
    let args = process.argv;
    if(args.length < 4 || args[2] !== "github-activity"){
        console.log("the command should be 'node app.js github-activity <username>");
        return;
    }

    try {
        const username = args[3];
        const recentActivityResponse  = await fetch(`https://api.github.com/users/${username}/events`);
        const recentActivity = await recentActivityResponse.json();

        if(!Array.isArray(recentActivity) && recentActivity.status == '404'){
            throw new Error('user name not found');
            return;
        }

        recentActivity.forEach((activity, index) => {
            processActivity(activity);
        });
    } catch(err){
        console.log(`There is an error : ${err.message}`);
    }
}
main();
