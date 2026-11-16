"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Public (unauthenticated) API permissions the Next.js frontend needs.
 * Content types that don't exist in this build are skipped.
 */
const PUBLIC_PERMISSIONS = {
    // Single types: read
    'api::home-page.home-page': ['find'],
    'api::about-us-page.about-us-page': ['find'],
    'api::services-page.services-page': ['find'],
    'api::become-a-host-page.become-a-host-page': ['find'],
    'api::become-an-agent-page.become-an-agent-page': ['find'],
    'api::contact-us-page.contact-us-page': ['find'],
    'api::join-us-page.join-us-page': ['find'],
    // Collection types: read
    'api::blog.blog': ['find', 'findOne'],
    'api::partner-app.partner-app': ['find', 'findOne'],
    'api::partner-page.partner-page': ['find', 'findOne'],
    // Form submissions: create only (never expose submitted data publicly)
    'api::contact-submission.contact-submission': ['create'],
    'api::host-submission.host-submission': ['create'],
    'api::agent-submission.agent-submission': ['create'],
};
exports.default = {
    register() { },
    async bootstrap({ strapi }) {
        try {
            const publicRole = await strapi
                .query('plugin::users-permissions.role')
                .findOne({ where: { type: 'public' } });
            if (!publicRole) {
                strapi.log.warn('[permissions] Public role not found; skipping.');
                return;
            }
            for (const [uid, actions] of Object.entries(PUBLIC_PERMISSIONS)) {
                if (!strapi.contentTypes[uid]) {
                    strapi.log.warn(`[permissions] Content type ${uid} not found; skipping.`);
                    continue;
                }
                for (const action of actions) {
                    const fullAction = `${uid}.${action}`;
                    const existing = await strapi
                        .query('plugin::users-permissions.permission')
                        .findOne({ where: { action: fullAction, role: publicRole.id } });
                    if (!existing) {
                        await strapi.query('plugin::users-permissions.permission').create({
                            data: { action: fullAction, role: publicRole.id },
                        });
                        strapi.log.info(`[permissions] Granted public access: ${fullAction}`);
                    }
                }
            }
        }
        catch (error) {
            strapi.log.error('[permissions] Failed to grant public access', error);
        }
    },
};
