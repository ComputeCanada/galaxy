/** This class renders the chart configuration form. */
define( [ 'utils/utils', 'mvc/ui/ui-misc', 'mvc/form/form-view', 'mvc/ui/ui-table' ], function( Utils, Ui, Form, Table ) {
    var Collection = Backbone.Collection.extend({
        comparator: function( a, b ) {
            a = a.get( 'name' );
            b = b.get( 'name' );
            return a > b ?  1 : a < b ? -1 : 0;
        }
    });

    var View = Backbone.View.extend({
        initialize: function( options ) {
            var self = this;
            this.model = new Backbone.Model();
            this.model.url = Galaxy.root + 'api/users/' + Galaxy.user.id + '/custom_builds_metadata';
            this.collection = new Collection();
            this.collection.url = Galaxy.root + 'api/users/' + Galaxy.user.id + '/custom_builds';
            this.message = new Ui.Message({});
            this.table = new Table.View( { cls: 'grid', selectable: false } );
            this.table.addHeader( 'Name' );
            this.table.addHeader( 'Key' );
            this.table.addHeader( 'Number of chroms/contigs' );
            this.table.addHeader( '' );
            this.table.appendHeader();
            this.setElement( $( '<div/>' ).append( $( '<h4/>' ).text( 'Current Custom Builds' ) )
                                          .append( this.table.$el )
                                          .append( $( '<h4/>' ).text( 'Add a Custom Build' ).addClass( 'ui-margin-top' ) )
                                          .append( this.message.$el )
                                          .append( this.$form = $( '<div/>' ).addClass( 'ui-margin-top' ) ) );
            this.listenTo( this.collection, 'add remove reset', function() { self._renderTable() } );
            this.listenTo( this.model, 'change', function() { self._renderForm() } );
            this.collection.fetch();
            this.model.fetch();
        },

        render: function() {
            this._renderTable();
            this._renderForm();
        },

        _renderTable: function() {
            var self = this;
            this.table.delAll();
            this.collection.sort();
            this.collection.each( function( model ) {
                self.table.add( model.id );
                self.table.add( model.get( 'name' ) );
                self.table.add( model.get( 'count' ) !== undefined ? model.get( 'count' ) : '-' );
                self.table.add( ( new Ui.ButtonIcon({
                    icon    : 'fa-trash-o',
                    cls     : 'ui-button-icon-plain',
                    tooltip : 'Delete custom build.',
                    onclick : function() { model.destroy() }
                } ) ).$el );
                self.table.append( model.id );
            });
        },

        _renderForm: function() {
            var self = this;
            var form = new Form({
                inputs  : [{
                    type    : 'text',
                    name    : 'name',
                    label   : 'Name',
                    help    : 'Specify a build name e.g. Hamster.'
                },{
                    type    : 'text',
                    name    : 'id',
                    label   : 'Key',
                    help    : 'Specify a build key e.g. hamster_v1.'
                },{
                    name        : 'len',
                    type        : 'conditional',
                    test_param  : {
                        name    : 'type',
                        label   : 'Definition',
                        help    : 'Provide the data source.',
                        type    : 'select',
                        value   : 'file',
                        data    : [ { value : 'fasta',  label : 'FASTA-file from history' },
                                    { value : 'file',   label : 'Len-file from history' },
                                    { value : 'text',   label : 'Len-file by copy/paste' } ]
                    },
                    cases       : [ {
                        value   : 'fasta',
                        inputs  : [ {
                            type   : 'select',
                            name   : 'value',
                            label  : 'FASTA-file',
                            data   : this.model.get( 'fasta_hdas' )
                        } ]
                    },{
                        value   : 'file',
                        inputs  : [ {
                            type   : 'upload',
                            name   : 'value',
                            label  : 'Len-file',
                            data   : this.model.get( 'len_hdas' )
                        } ]
                    },{
                        value   : 'text',
                        inputs  : [ {
                            type   : 'text',
                            area   : true,
                            name   : 'value',
                            label  : 'Edit/Paste'
                        } ]
                    } ]
                }],
                buttons : {
                    save    : new Ui.Button({
                        icon     : 'fa-save',
                        tooltip  : 'Create new Build',
                        title    : 'Save',
                        cls      : 'ui-button btn btn-primary',
                        floating : 'clear',
                        onclick  : function() {
                            var data = form.data.create();
                            if ( !data.id || !data.name ) {
                                self.message.update( { message: 'All inputs are required.', status: 'danger' } );
                            } else {
                                self.collection.create( data, {
                                    wait    : true,
                                    success : function( response ) {
                                        if ( response.get( 'message' ) ) {
                                            self.message.update( { message: response.get( 'message' ), status: 'warning' } );
                                        } else {
                                            self.message.update( { message: 'Successfully added a new custom build.', status: 'success' } );
                                        }
                                        _.each( form.field_list, function( field ) { field.value( null ) } );
                                    },
                                    error   : function( response, err ) {
                                        var message = err && err.responseJSON && err.responseJSON.err_msg;
                                        self.message.update( { message: message || 'Failed to create custom build.', status: 'danger' } );
                                    }
                                });
                            }
                        }
                    })
                }
            });
            this.$form.empty().append( form.$el );
        }
    });

    return {
        View: View
    }
});