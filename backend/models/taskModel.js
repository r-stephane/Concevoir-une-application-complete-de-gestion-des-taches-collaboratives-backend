const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: ['Basse', 'Moyenne', 'Haute'],
        default: 'Moyenne'
    },
    dueDate: {
        type: Date,
        default: null 
    },
    // NOUVEAU CHAMP POUR LE SUIVI DE L'AVANCEMENT
    status: {
        type: String,
        enum: ['À faire', 'En Cours', 'Terminé'], // États possibles
        default: 'À faire' // Statut initial par défaut
    },
    // Le champ 'completed' n'est plus nécessaire si 'status' est utilisé
    
    userId: { // La personne qui a créé la tâche
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client' 
    },
    assignedTo: { // La personne à qui la tâche est assignée
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Client',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;