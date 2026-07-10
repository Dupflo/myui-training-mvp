/**
 * transactional service
 */


export default {
  // async sendTransactionalEmail(to: string, data: any, templateId: number) {
  //   try {
  //     let apiInstance = new brevo.TransactionalEmailsApi()

  //     let sendSmtpEmail = new brevo.SendSmtpEmail()

  //     sendSmtpEmail.templateId = templateId
  //     sendSmtpEmail.sender = { name: "B2C Buzz", email: "contact@b2cbuzz.fr" }
  //     sendSmtpEmail.to = [{ email: to }]
  //     sendSmtpEmail.params = data

  //     const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
  //     return response
  //   } catch (error) {
  //     console.error(error)
  //   }
  // },
  async getContact(email: string, api_key: string) {
    try {
      const brevo = require('@getbrevo/brevo');

      let apiInstance = new brevo.ContactsApi()
      let apiKey = apiInstance.authentications['apiKey'];
      apiKey.apiKey = api_key ?? process.env.BREVO_API_KEY;

      const existingContact = await apiInstance.getContactInfo(email);
      return existingContact
    } catch (error) {
      return error
    }
  },
  async addEmailToUserList({ name, email, organization, listId, tags, custom_key }: { name: string, email: string, organization: string, listId: string, tags?: string, custom_key?: string }) {
    const brevo = require('@getbrevo/brevo');
    let apiInstance = new brevo.ContactsApi();

    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = custom_key ?? process.env.BREVO_API_KEY;
    try {
      let createContact = new brevo.CreateContact();
      const splittedName = name.split(' ');

      createContact.email = email;
      createContact.listIds = [listId]
      createContact.attributes = {
        "PRENOM": splittedName[0],
        "NOM": splittedName[1],
        "ORGANIZATION": organization,
        "TAGS": tags ? [tags] : undefined
      };

      // Tente de créer le contact
      const response = await apiInstance.createContact(createContact);
      return response;
    } catch (error: any) {
      // Vérifie si l'erreur est due à un email déjà existant
      if (error.response && error.response.body && error.response.body.code === 'duplicate_parameter') {
        try {
          console.info(`Email ${email} already exists, updating lists...`);

          // Récupérer l'ID du contact existant
          const existingContact = await apiInstance.getContactInfo(email);
          const contactId = existingContact.body.id;
          const existingLists = existingContact.body.listIds || [];
          const existingTags = existingContact.body.attributes?.TAGS || [];

          // Ajouter la liste si elle n'est pas déjà assignée
          const listIds = existingLists.includes(listId) ? existingLists : [...existingLists, listId];

          // Ajouter le tag s'il n'est pas déjà présent (attribution indépendante de la liste)
          const updatedTags = tags && !existingTags.includes(tags) ? [...existingTags, tags] : existingTags;

          const splittedName = name.split(' ');
          // Toujours mettre à jour le contact : liste ET tags
          await apiInstance.updateContact(contactId, {
            listIds,
            attributes: {
              "PRENOM": splittedName[0],
              "NOM": splittedName[1],
              "ORGANIZATION": organization,
              "TAGS": updatedTags.length ? updatedTags : undefined
            }
          });
          console.info(`Contact ${email} updated (list ${listId}, tag ${tags})`);

          return { message: `Contact updated and added to list ${listId}` };
        } catch (updateError) {
          console.error("Failed to update existing contact:", updateError);
          return updateError;
        }
      }

      console.error("Unexpected error:", error);
      return error;
    }
  }
}
