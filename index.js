const TelegramBot = require('node-telegram-bot-api');
const token = '7385440107:AAF08xO4q5pPrV38X678wsBGHBxnG-JTNSA';
const bot = new TelegramBot(token, { polling: true });

// ==============================================
// MESSAGES DE DOCUMENTATION
// ==============================================

const DOCS = {
  welcome: `🌟 *MYDBASE DOCUMENTATION BOT*  
_Votre assistant pour maîtriser MyDBase_  

Sélectionnez une catégorie :`,

  info: `ℹ️ *INFORMATIONS*  

**Concepteur** : DRX  
**Version** : 2.3.1  
**Type** : Base de données légère  
**Site** : [myd-base.com](https://myd-base.com)  

Un projet open-source pour les développeurs qui veulent une solution DB simple et efficace.`,

  // ================= CRUD =================
  crud: `📚 *CRUD OPERATIONS*  
Sélectionnez une opération :`,

// ================= CONNEXION =================
connect: `🔌 *CONNEXION: db.start(dbName, path, appId)*  

📌 **Description**  
Établit une connexion à la base de données.

⚙️ **Paramètres**  
- \`dbName\` (String) - Nom de la base de données  
- \`path\` (String) - Source de la requête (ex: \`location.href\`)  
- \`appId\` (String) - Clé d'application MYD (format: "MYD-XXXXX")

🔄 **Retour**  
Promise résolue avec \`true\` si connexion réussie

🚨 **Erreurs possibles**  
- \`"DataBase name missed"\` - Nom de base manquant  
- \`"Path string missed"\` - Chemin non fourni  
- \`"Port string missed"\` - AppId manquant  
- \`"Connexion non établie"\` - Échec authentification  

💡 **Code Tip** 



\`\`\`javascript
const db = new MYDBASE();
db.start("ma_bdd", location.href, "MYD-6927C045C8D4")
.then(connected => {
  if (!connected) {
    console.error("Erreur:", db.error());
  }
});
\`\`\``,

// ================= INSERTION =================
insert: `📥 *INSERTION: db.insert(table, data)*  

📌 **Description**  
Insère des données dans une table.

⚙️ **Paramètres**  
- \`table\` (String) - Nom de la table  
- \`data\` (Object) - Données à insérer (format: \`{colonne: valeur}\`)

🔧 **Méthodes associées**  
- \`execute()\` → Booléen (succès/échec)  
- \`insert_ID()\` → ID du dernier insert  

🚨 **Erreurs possibles**  
- \`"Table name is missed"\` - Table non spécifiée  
- \`"Data is missed"\` - Données manquantes  
- \`"Invalid data format"\` - Format incorrect  

💡 **Code Tip**  
\`\`\`javascript
db.insert("users", {
name: "Jean",
email: "jean@exemple.com",
status: 1
}).then(() => {
if (db.execute()) {
  console.log("Nouvel ID:", db.insert_ID());
}
});
\`\`\``,


// ================= SELECTION =================
select:  `
🔍 *SELECTION: db.find(table, conditions, clauses)*  
📌 **Description**  
Récupère des données avec des filtres avancés.

⚙️ **Paramètres de base**  
- \`table\` - Table cible  
- \`conditions\` - Critères (ex: \`{id: 1}\`)  
- \`clauses\` - Options avancées 


📚 *CLAUSES DE SELECTION*  

1. **Pagination**  
 - \`LIMIT: 10\` - Nombre de résultats  
 - \`OFFSET: 5\` - Décalage  

2. **Tri**  
 - \`ORDERBY: "DESC"\` - Tri descendant  
 - \`RAND: "ON"\` - Aléatoire  

3. **Agrégations**  
 - \`COUNT: "colonne"\` - Compte les valeurs  
 - \`SUM: "colonne"\` - Somme  
 - \`MIN/MAX: "colonne"\` - Valeurs extrêmes  

4. **Filtres avancés**  
 - \`colonne_LIKE: "%val%"\` - Recherche texte  
 - \`colonne_NOT: "val"\` - Exclusion  
 - \`colonne_IN: "a,b,c"\` - Liste de valeurs  
 - \`colonne_BETWEEN: "10,20"\` - Plage numérique  

💡 **Exemple Complet**  
\`\`\`javascript
db.find("products", {
category: "electronics"
}, {
PRICE_BETWEEN: "100,500",
STOCK_GRT: 0,
LIMIT: 5,
ORDERBY: "DESC"
}).then(() => {
if (db.nums_row() > 0) {
console.log("Résultats:", db.result());
}
});
\`\`\``,

// ================= UPDATE =================
update: `🔄 *MISE À JOUR: db.update(table, updates, conditions, clauses)*  

📌 **Description**  
Modifie des enregistrements existants.

⚙️ **Paramètres**  
- \`table\` - Table cible  
- \`updates\` - Modifications (format: \`{col_SET: nouv_val}\`)  
- \`conditions\` - Critères de sélection  
- \`clauses\` - Options (LIMIT, etc.)

🚨 **Erreurs possibles**  
- \`"No conditions provided"\` - Sécurité: bloque les updates sans WHERE  
- \`"Invalid update format"\` - Format incorrect  

⚠️ **Attention**  
Pour forcer un UPDATE sans conditions:  
\`\`\`javascript
{ ALL: 'ON' } // DANGEREUX!
\`\`\`

💡 **Code Tip**  
\`\`\`javascript
// Mise à jour sécurisée
db.update("users", 
{ password_SET: "new_hash" },
{ id: 123 },
{ LIMIT: 1 }
);
\`\`\``,

// ================= DELETE =================
delete: `🗑️ *SUPPRESSION: db.unset(table, conditions, clauses)*  

📌 **Description**  
Supprime des enregistrements.

⚙️ **Paramètres**  
- \`table\` - Table cible  
- \`conditions\` - Critères OBLIGATOIRES  
- \`clauses\` - Options (LIMIT, etc.)

🚨 **Sécurité**  
Sans conditions, la requête est bloquée pour éviter des suppressions accidentelles.

💡 **Code Tip**  
\`\`\`javascript
// Suppression sécurisée
db.unset("logs", 
{ date_BEFORE: "2023-01-01" },
{ LIMIT: 1000 }
);

// ⚠️ NE PAS FAIRE:
// db.unset("users"); // Bloquerait!
\`\`\``,

// ================= FONCTIONS UTILITAIRES =================
functions: `⚙️ *FONCTIONS UTILITAIRES*  

1. \`nums_row()\` → Nombre total de résultats  
2. \`assoc()\` → Itérateur (usage: \`while(db.assoc())\`)  
3. \`assoc_result()\` → Données courantes  
4. \`min()/max()/sum()\` → Valeurs agrégées  
5. \`error()\` → Dernière erreur  

🔧 **Workflow Typique**  
\`\`\`javascript
db.find("table", {id: 1})
.then(() => {
  if (db.nums_row() > 0) {
    while (db.assoc()) {
      const row = db.assoc_result();
      console.log(row);
    }
  }
});
\`\`\``,

// ================= EXEMPLE MESSAGERIE =================
example: `💬 *EXEMPLE MESSAGERIE* (comme messagerie.html)  

🔍 **Structure Table**  
\`\`\`sql
CREATE TABLE messgestbl (
id INT AUTO_INCREMENT,
chatter VARCHAR(50),
sender VARCHAR(30),
content TEXT,
PRIMARY KEY(id)
);
\`\`\`

📨 **Envoyer un Message**  
\`\`\`javascript
db.insert("messgestbl", {
chatter: 'user1-user2',
sender: 'user1',
content: 'Bonjour!'
});
\`\`\`

📩 **Récupérer les Messages**  
\`\`\`javascript
db.find("messgestbl", {
chatter: 'user1-user2'
}, {
ORDERBY: 'DESC',
LIMIT: 50
}).then(() => {
// Traitement...
});
\`\`\``,

  // ================= CONTROL =================
  control: `🎮 *CONTROL PANEL*  
Fonctions en développement :  

▸ Visualisation des tables  
▸ Exécution de requêtes SQL  
▸ Export/Import de données  

*Disponible prochainement...*`,

  // ================= AUTH =================
  auth: `🔐 *MYD AUTH*  
Fonctionnalités d'authentification :  

▸ \`auth.login(user, pass)\`  
▸ \`auth.register(userData)\`  
▸ \`auth.resetPassword(email)\`  

*Documentation à venir...*`,

  // ================= MAIL =================
  mail: `✉️ *MYD MAIL*  
Fonctionnalités d'envoi d'emails :  

▸ \`mail.send(to, subject, content)\`  
▸ \`mail.bulkSend(recipients)\`  
▸ \`mail.templates(name, data)\`  

*Documentation à venir...*`
};

// ==============================================
// KEYBOARDS INTERACTIFS
// ==============================================

const KEYBOARDS = {
  main: {
    reply_markup: {
      keyboard: [
        ["📚 CRUD", "🔐 MYD AUTH"],
        ["✉️ MYD MAIL", "🎮 CONTROL"],
        ["ℹ️ INFO"]
      ],
      resize_keyboard: true
    }
  },
  crud: {
    reply_markup: {
      keyboard: [
        ["🔌 CONNECT", "📥 INSERT"],
        ["🔍 SELECT", "🔄 UPDATE"],
        ["🗑️ DELETE", "⬅️ BACK"]
      ],
      resize_keyboard: true
    }
  },
  back: {
    reply_markup: {
      keyboard: [["⬅️ BACK"]],
      resize_keyboard: true
    }
  }
};

// ==============================================
// GESTION DES COMMANDES
// ==============================================

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, DOCS.welcome, {
    parse_mode: 'Markdown',
    reply_markup: KEYBOARDS.main.reply_markup
  });
});

// ==============================================
// GESTION DES BOUTONS
// ==============================================

bot.on('message', (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  // Menu Principal
    if (text === '📚 CRUD') {
    // Invitation à insérer le script dans le DOM
    const insertionMessage = `📜 Pour commencer avec CRUD, veuillez insérer le script suivant dans votre DOM avant toutes déclarations :\n\n\`\`\`html\n<script type="text/javascript" src="https://myd-base.com/dbs_console/scripts/javascripts/mydbase.js" defer></script>\n\`\`\``;
    
    bot.sendMessage(chatId, insertionMessage, {
      parse_mode: 'Markdown',
      reply_markup: KEYBOARDS.crud.reply_markup
    });
    return;
  }


  if (text === '🔐 MYD AUTH') {
    bot.sendMessage(chatId, DOCS.auth, {
      parse_mode: 'Markdown',
      reply_markup: KEYBOARDS.back.reply_markup
    });
    return;
  }

  if (text === '✉️ MYD MAIL') {
    bot.sendMessage(chatId, DOCS.mail, {
      parse_mode: 'Markdown',
      reply_markup: KEYBOARDS.back.reply_markup
    });
    return;
  }

  if (text === '🎮 CONTROL') {
    bot.sendMessage(chatId, DOCS.control, {
      parse_mode: 'Markdown',
      reply_markup: KEYBOARDS.back.reply_markup
    });
    return;
  }

  if (text === 'ℹ️ INFO') {
    bot.sendMessage(chatId, DOCS.info, {
      parse_mode: 'Markdown',
      reply_markup: KEYBOARDS.back.reply_markup
    });
    return;
  }

  // Menu CRUD
  if (text === '🔌 CONNECT') {
    sendDocumentation(chatId, 'connect');
    return;
  }

  if (text === '📥 INSERT') {
    sendDocumentation(chatId, 'insert');
    return;
  }

  if (text === '🔍 SELECT') {
    sendDocumentation(chatId, 'select');
    return;
  }

  if (text === '🔄 UPDATE') {
    sendDocumentation(chatId, 'update');
    return;
  }

  if (text === '🗑️ DELETE') {
    sendDocumentation(chatId, 'delete');
    return;
  }

  // Bouton Retour
  if (text === '⬅️ BACK') {
    bot.sendMessage(chatId, "Menu Principal:", {
      reply_markup: KEYBOARDS.main.reply_markup
    });
    return;
  }
});

function sendDocumentation(chatId, docKey) {
  bot.sendMessage(chatId, DOCS[docKey], {
    parse_mode: 'Markdown',
    reply_markup: KEYBOARDS.back.reply_markup
  });
}


console.log('✅ Bot MyDBase prêt !');
