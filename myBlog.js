Data = new Mongo.Collection("data");
Comments = new Mongo.Collection("comments");

Meteor.methods({
    parseDate: function(){
      var date = new Date();
      
      var day = date.getDate();
      var monthIndex = (date.getMonth() < 10 ? '0' : '' ) + date.getMonth();
      var year = date.getFullYear();
      var hour = date.getHours();
      var min = (date.getMinutes() < 10 ? '0' : '' ) + date.getMinutes();

      return day + "." + monthIndex + "." + year + " " + hour + ":" + min;
    }
});

if (Meteor.isClient) {


  Template.body.helpers({
     data: function () {
      return Data.find({}, {sort: {createdAt: -1}});
    },
    count: function() {
      return Data.find().count();
    }
  });

  Template.body.events({

    'submit .new-data': function (event) {
      var title = event.target.title.value;
      var text = event.target.text.value;
      var color = event.target.textcolor.value;

      if (title != "" && text != "") {
        Meteor.call('parseDate', function(error, currentDate){
            Data.insert({
              title: title,
              text: text,
              textcolor: color,
              createdAt: currentDate // current time
            });
        });

      } else {
        alert("Title and content article are required!");
      }

    }
  });

   Template.date.events({
    "click .delete": function () {
      res = confirm("Are you sure?");
      if(res) {
        Data.remove(this._id);
        Comments.remove({art_id: this._id});
      }
    },
    "click .showcomm": function (event, template) {
      new_comm_form = template.find(".new-comm");
      if(new_comm_form.style.display == 'none')
        new_comm_form.style.display = 'block';
      else
        new_comm_form.style.display = 'none';
    }
  });

   Template.date.helpers({
    num_comm: function(article_id) {
      return Comments.find({art_id: article_id}).count();
    }
  });

  Template.comments.events({
      'submit .new-comm': function (event) {
      var name = event.target.nameComm.value;
      var comm = event.target.comm.value;

      if (name != "" && comm != "") {
          Comments.insert({
            name: name,
            comm: comm,
            art_id: this._id
          });

      } else {
        alert("Title and content article are required!");
      }

    }
  });
  

  Template.comments.helpers({
    getComments: function (article_id) {
      return Comments.find({art_id: article_id}, {});
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
