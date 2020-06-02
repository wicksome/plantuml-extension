import OptionsSyncPerDomain from 'webext-options-sync-per-domain'
export const perDomainOptions = new OptionsSyncPerDomain({
	defaults: {
		baseUrl: 'https://www.plantuml.com/plantuml/img/',
		profile: 'github'
	},
	migrations: [OptionsSyncPerDomain.migrations.removeUnused],
	logging: true,
})
export default perDomainOptions.getOptionsForOrigin()
