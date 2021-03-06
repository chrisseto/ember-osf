import Ember from 'ember';
import layout from './template';
import { serviceLinks, osfServices } from '../../const/service-links';
import hostAppName from '../../mixins/host-app-name';
import config from 'ember-get-config';
import AnalyticsMixin from 'ember-osf/mixins/analytics';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display the new OSF navbar - features primary navigation to toggle between services - HOME, PREPRINTS, REGISTRIES, and MEETINGS,
 * and secondary navigation links for each particular service.
 *
 * Sample usage:
 * ```handlebars
 * {{osf-navbar
 *   loginAction=loginAction
 * }}
 * ```
 *
 * @class osf-navbar
 */
export default Ember.Component.extend(hostAppName, AnalyticsMixin, {
    layout,
    osfServices,
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),
    serviceLinks: serviceLinks,
    host: config.OSF.url,
    currentService: Ember.computed('hostAppName', function() { // Pulls current service name from consuming service's config file
        let appName = this.get('hostAppName') || 'Home';
        if (appName === 'Dummy App') {
            appName = 'Home';
        }
        return appName.toUpperCase();
    }),
    currentServiceLink: Ember.computed('serviceLinks', 'currentService', function() {
        const serviceMapping = {
            HOME: 'osfHome',
            MEETINGS: 'meetingsHome',
            PREPRINTS: 'preprintsHome',
            REGISTRIES: 'registriesHome',
            REVIEWS: 'reviewsHome',
        };
        const service = this.get('currentService');
        return this.get('serviceLinks')[serviceMapping[service]];
    }),
    showSearch: false,
    actions: {
        // Toggles whether search bar is displayed (for searching OSF)
        toggleSearch() {
            this.toggleProperty('showSearch');
            this.send('closeSecondaryNavigation');
        },
        closeSecondaryNavigation() {
            this.$('.navbar-collapse').collapse('hide');
        },
        closeSearch() {
            this.set('showSearch', false);
        },
        closeSecondaryAndSearch() {
            this.send('closeSecondaryNavigation');
            this.send('closeSearch');
        }
    }
});
