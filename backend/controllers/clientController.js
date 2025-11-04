const clientModel = require("../models/clientModel");
const TaskModel = require("../models/taskModel");
//afficher tous les produits

const getClients = async (req, res) => {
  const clients = await clientModel.find();
  res.send(clients);
};

//afficher un produit par son id

const getClientId = async (req, res) => {
  const id = req.params.id;

  const client = await clientModel.findById(id);

  if (!client) {
    res.status(404).send("Client not found.");
    return;
  }

  res.send({
    message: "Client found",
    client,
  });
};

//ajouter un client

const addClient = async (req, res) => {
  const { clientName, role, stockStatus } = req.body;

  const allowedStatus = ["admin", "user", "client"];

  if (stockStatus && !allowedStatus.includes(stockStatus)) {
    // bad request
    res
      .status(400)
      .send(
        `The clients stock status should be one the followings: ${allowedStatus}`
      );
    return;
  }

  const client = await clientModel.create({
    clientName,
    role,
    stockStatus,
    userId: req.decoded.userId, // ID de l'utilisateur courant (connecté)
  });

  res.send({
    message: "Product successfully added.",
    client,
  });
};
// mettre à jour un produit

const updateClient = async (req, res) => {
  const id = req.params.id;
  const { clientName, role } = req.body;

  const clientExists = await clientModel.findById(id);

  if (!clientExists) {
    res.status(404).send("client not found");
    return;
  }

  const updClient = await clientModel.findByIdAndUpdate(
    id,
    { clientName, role },
    { new: true }
  );

  res.send({
    message: "Product updated successfully.",
    updClient,
  });
};

const updateStock = async (req, res) => {
  const id = req.params.id;
  const stockStatus = req.params.status;

  const clientExists = await clientModel.findById(id);

  if (!clientExists) {
    res.status(404).send("client not found");
    return;
  }

  const allowedStatus = ["admin", "user", "client"];
  if (!allowedStatus.includes(stockStatus)) {
    // bad request
    res
      .status(400)
      .send(
        `The products stock status should be one the followings: ${allowedStatus}`
      );
    return;
  }

  const updatedClient = await clientModel.findByIdAndUpdate(
    id,
    { stockStatus },
    { new: true }
  );

  res.send({
    message: "client status updated successfully.",
    updatedClient,
  });
};

const deletedClient = async (req, res) => {
  const id = req.params.id;

  // produit = clientModel.findById(id)

  let client = await clientModel.findById(id);

  // si produit.userId != req.decoded.userId => quitter avec un message
  console.log(client.userId != req.decoded.userId);

  if (client.userId != req.decoded.userId) {
    res.status(401).send("action not authorizied.");
    return;
  }
  const deletedClient = await clientModel.findByIdAndDelete(id);

  if (!deletedClient) {
    res.status(404).send("client not found.");
    return;
  }
  res.send({
    message: "client deleted successfully.",
    deletedClient,
  });
};
// Ajouter une nouvelle tâche AVEC ASSIGNATION
const addTask = async (req, res) => {
  // La description est obligatoire pour une tâche
  const { description, priority, dueDate, assignedTo } = req.body;

  // 1. Vérification minimale
  if (!description) {
    return res.status(400).send("La description de la tâche est requise.");
  }

  // 2. Optionnel: Validation de la priorité
  const allowedPriorities = ["Basse", "Moyenne", "Haute"];
  if (priority && !allowedPriorities.includes(priority)) {
    return res
      .status(400)
      .send(
        `La priorité doit être l'une des suivantes : ${allowedPriorities.join(
          ", "
        )}`
      );
  }

  // 3. Vérifier si le membre de l'équipe assigné existe
  if (assignedTo) {
    const teamMemberExists = await clientModel.findById(assignedTo);
    if (!teamMemberExists) {
      return res
        .status(404)
        .send("Le membre de l'équipe assigné (assignedTo) n'existe pas.");
    }
  }

  try {
    // 4. Création de la tâche dans la base de données
    const task = await TaskModel.create({
      description,
      priority: priority || "Moyenne",
      dueDate: dueDate || null,
      status: "À faire", // Défaut : 'À faire'
      userId: req.decoded.userId,
      assignedTo: assignedTo || null,
    });

    // 5. Réponse de succès
    res.status(201).send({
      message: "Tâche ajoutée et assignée avec succès.",
      task,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
    res
      .status(500)
      .send("Erreur interne du serveur lors de la création de la tâche.");
  }
};

// NOUVEAU : Fonction pour mettre à jour le statut d'une tâche
const updateTaskStatus = async (req, res) => {
  const taskId = req.params.id;
  const newStatus = req.params.status; // Le nouveau statut est passé dans l'URL (par exemple, /tasks/60c72b2f/Terminé)

  const allowedStatus = ["À faire", "En Cours", "Terminé"];

  // 1. Validation du nouveau statut
  if (!allowedStatus.includes(newStatus)) {
    return res
      .status(400)
      .send(
        `Le statut doit être l'une des valeurs suivantes : ${allowedStatus.join(
          ", "
        )}.`
      );
  }

  try {
    // 2. Recherche et mise à jour de la tâche
    const updatedTask = await TaskModel.findOneAndUpdate(
      // On vérifie que la tâche appartient à l'utilisateur ou lui est assignée avant de permettre la mise à jour
      {
        _id: taskId,
        $or: [
          { userId: req.decoded.userId },
          { assignedTo: req.decoded.userId },
        ],
      },
      { status: newStatus },
      { new: true } // Retourne le document mis à jour
    );

    if (!updatedTask) {
      // La tâche n'existe pas ou l'utilisateur n'est ni le créateur ni l'assigné
      return res
        .status(404)
        .send(
          "Tâche non trouvée ou autorisation insuffisante pour la mise à jour."
        );
    }

    // 3. Réponse de succès
    res.send({
      message: `Statut de la tâche mis à jour à : ${newStatus}`,
      task: updatedTask,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.status(500).send("Erreur interne du serveur.");
  }
};

// Exportez la nouvelle fonction à la fin du fichier :
module.exports = {
  getClients,
  getClientId,
  addClient,
  updateClient,
  updateStock,
  deletedClient,
  addTask,
  updateTaskStatus,
};
