export interface responseproyect {
    ok:      boolean;
    message: string;
    body:    Body[];
  }
  
  export interface Body {
    id: string;
    username: string;
    password: string;
    rol:      string;
    email:    string;
  }
  