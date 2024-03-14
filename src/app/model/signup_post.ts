export interface User {
    uid:        number;
    username:   string;
    name:       string;
    image:      string;
    createDate: string;
    note:       string;
    type:       string;
    password:   string;
  }

  export interface SignupData {
    name: string;
    username: string;
    password: string;
    type : string;
    file : File;
  }
  