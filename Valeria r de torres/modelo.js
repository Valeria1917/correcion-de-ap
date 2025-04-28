
Dueño = {
    Nombre: String,
    Email: String,
    direccion: String,
    contrasenna: String
}

Mascotas = [
    {
        NombreDueño: String,
        EmailDueño: String,
        nombre: String,
        especie: String,
        raza: String,
        edad: Integer,
        estadoSalud: String,
        vacunas: [
            {
                nombreVacuna: String,
                fechaAplicacion: Date,
                vacunaUnica: Boolean,
                proximaAplicacion: Date
            }
        ]
    }
]

Citas = {
    nombreDueño: String,
    nombreMascota: String,
    fechaCita: Date,
    motivo: String,
    estado: String
}




db.Citas.find({
    estado: "Pendiente",
    fechaCita: { $gte: ISODate("2025-03-29T00:00:00Z"), $lte: ISODate("2025-04-05T23:59:59Z") }
})


db.Mascotas.find(
    { estadoSalud: "Enfermo" },
    { nombre: 1, NombreDueño: 1, estadoSalud: 1 }
)
