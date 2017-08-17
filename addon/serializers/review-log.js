import OsfSerializer from './osf-serializer';
import Ember from 'ember';

export default OsfSerializer.extend({
    serialize(snapshot) {
        // Normal OSF serializer strips out relationships. We need to add back reviewable for this endpoint
        const res = this._super(...arguments);
        res.data.relationships = {};
        for (var rel in snapshot.record._dirtyRelationships) {
            let relationship = Ember.String.underscore(rel);
            res.data.relationships[relationship] = {
                data: {
                    id: snapshot.belongsTo(rel, { id: true }),
                    type: relTypes[rel]
                }
            };
        }
        return res;
    }

});

// Type mapping for relationship fields
const relTypes = {
    reviewable: 'preprints',
};
