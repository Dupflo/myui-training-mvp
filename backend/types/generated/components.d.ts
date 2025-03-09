import type { Schema, Struct } from '@strapi/strapi';

export interface LandingPageProgramLink extends Struct.ComponentSchema {
  collectionName: 'components_landing_page_program_links';
  info: {
    description: '';
    displayName: 'Program Link';
    icon: 'calendar';
  };
  attributes: {
    program: Schema.Attribute.Relation<'oneToOne', 'api::program.program'>;
    title: Schema.Attribute.String;
  };
}

export interface ProgramBlocksModule extends Struct.ComponentSchema {
  collectionName: 'components_program_blocks_modules';
  info: {
    description: '';
    displayName: 'Module';
    icon: 'bulletList';
  };
  attributes: {
    color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultMarkdown';
        }
      >;
    title: Schema.Attribute.String;
    videos: Schema.Attribute.Component<'program-elements.video', true>;
  };
}

export interface ProgramElementsRessource extends Struct.ComponentSchema {
  collectionName: 'components_program_elements_ressources';
  info: {
    description: '';
    displayName: 'Ressource';
    icon: 'folder';
  };
  attributes: {
    icon: Schema.Attribute.Text &
      Schema.Attribute.CustomField<
        'plugin::icons-field.icon',
        {
          filter: [''];
          output: 'svg';
          selection: [''];
        }
      >;
    link: Schema.Attribute.String;
    media: Schema.Attribute.Media<'files' | 'images' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface ProgramElementsVideo extends Struct.ComponentSchema {
  collectionName: 'components_program_elements_videos';
  info: {
    description: '';
    displayName: 'Video';
    icon: 'play';
  };
  attributes: {
    media: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<'plugin::video-field.video'>;
    title: Schema.Attribute.String;
  };
}

export interface ProgramModelsModules extends Struct.ComponentSchema {
  collectionName: 'components_program_models_modules';
  info: {
    description: '';
    displayName: 'Modules';
    icon: 'apps';
  };
  attributes: {
    modules: Schema.Attribute.Component<'program-blocks.module', true>;
    title: Schema.Attribute.String;
  };
}

export interface ProgramModelsRessources extends Struct.ComponentSchema {
  collectionName: 'components_program_models_ressources';
  info: {
    description: '';
    displayName: 'Ressources';
    icon: 'archive';
  };
  attributes: {
    resources: Schema.Attribute.Component<'program-elements.ressource', true>;
    title: Schema.Attribute.String;
  };
}

export interface StripeConnectedAccount extends Struct.ComponentSchema {
  collectionName: 'components_stripe_connected_accounts';
  info: {
    description: '';
    displayName: 'Connected Account';
    icon: 'user';
  };
  attributes: {
    account: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    fee_amount: Schema.Attribute.Decimal;
  };
}

export interface TransactionalBrevo extends Struct.ComponentSchema {
  collectionName: 'components_transactional_brevos';
  info: {
    description: '';
    displayName: 'Brevo';
    icon: 'envelop';
  };
  attributes: {
    brevo_key: Schema.Attribute.String;
    list_id: Schema.Attribute.Integer;
    tag: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'landing-page.program-link': LandingPageProgramLink;
      'program-blocks.module': ProgramBlocksModule;
      'program-elements.ressource': ProgramElementsRessource;
      'program-elements.video': ProgramElementsVideo;
      'program-models.modules': ProgramModelsModules;
      'program-models.ressources': ProgramModelsRessources;
      'stripe.connected-account': StripeConnectedAccount;
      'transactional.brevo': TransactionalBrevo;
    }
  }
}
