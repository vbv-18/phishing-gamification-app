
let signOutHandler: (() => Promise<void>) | null = null;
let isSignOut = false; //to avoid multiple sign outs

export function sHandler(handler: () => Promise<void>){
    signOutHandler = handler;
}

export async function triggerSignOut(){ //for axios to call the signout without knowing React
    if(signOutHandler && !isSignOut){
        isSignOut = true;
        await signOutHandler();
    }
}