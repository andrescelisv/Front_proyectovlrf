export interface Docentes {
    ok:      boolean;
    message: string;
    body:    Body[];
}

export interface Estudiantes {
    ok:      boolean;
    message: string;
    body:    Body[];
}
export interface Body {
    id:                string;
    nombre:            string;
    correoElectrónico: string;
    fechaNacimiento:   string;
    cedula:            string;
    grado:             Grado[];
    materia:           Materia[];
    institucion:       institucion[];
}

export interface Grado {
    id:     string;
    nombre: string;
}

export interface Materia {
    id:     string;
    nombre: string;
}

export interface institucion {
    id:     string;
    nombre: string;
}
