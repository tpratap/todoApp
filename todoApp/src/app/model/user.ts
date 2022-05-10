
export interface Todo {
    // static ids: number = 0;
    id: string;
    title: string;
    status: string;
    desc: string;
    deadline: string; 
}

export interface TodoUser {
    uid: string;
    emailId: string;
    passkey: string;
}
