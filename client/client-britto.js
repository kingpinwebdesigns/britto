  Posts = new Meteor.Collection("Posts");

  Meteor.subscribe("allposts");

  Template.posts.postlist = function() {
    return Posts.find({}, {sort: {created: -1}});
  }

  Template.userArea.user = function() {
    return Session.get('user');
  }

  Template.userArea.events = {
    'submit #login-form, click #login-button': function() {
      Meteor.call('login', $('#login-username').val(), $('#login-password').val(), loginCallback);
      return false;
    },
    'submit #post-form, click #post-button': function() {
      Meteor.call('post', {title: $('#post-title').val(), body: $('#post-body').val(), slug: $('#post-slug').val(), auth: Session.get('auth')}, postCallback);
      return false;
    }
  }

  function postCallback(error, returnVal) {
    console.log('makeapost');
  }

  function loginCallback(error, returnVal) {
    if(!error) {
      Session.set('auth', returnVal.auth);
      Session.set('user', returnVal);
    }
    return false;
  }

  Handlebars.registerHelper('date', function(date) {
    if(date) {
      return date;
    } else {
      return Date().toString();
    }
  });

  Handlebars.registerHelper('content', function() {
    if(Session.equals('new_page', 'post')) {
      post = Posts.findOne({slug: Session.get('new_slug')});
      if(post) {
        return Meteor.ui.chunk(function() { return Template.postView(post); });
      }
    }
    return Meteor.ui.chunk(function() { return Template.listView(); });
    return '';
  });

  BrittoRouter = Backbone.Router.extend({
    routes: {
      ":slug": "findPost",
      ":slug/": "findPost"
    },
    findPost: function(slug) {
      Session.set('new_page', 'post');
      Session.set('new_slug', slug);
    }
  });
  Router = new BrittoRouter;
  Meteor.startup(function () {
    Backbone.history.start({pushState: true});
  });