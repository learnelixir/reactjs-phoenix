/**
 * @jsx React.DOM
 */

var LinkHandlerMixin = {
  handleLinkClicked : function(e) {
    e.preventDefault();
    var target = $(e.target);
    var url = target.attr("href");
    var method = target.data("method");
    if(!method) {
      method = "GET";
    }//end if
    if(method == "GET") {
      this.props.router.navigate(url, {
        trigger : true
      });
    } else {
      var redirectURL = target.data("redirect-to");
      var confirm = target.data("confirm");
      var confirmResult = true;
      if(confirm) {
        confirmResult = window.confirm(confirm);
      }//end if
      if(confirmResult) {
        $.ajax({
          type: method,
          url: url,
          success: function() {
            this.props.router.navigate(redirectURL, {
              trigger: true
            });
          }.bind(this)
        });
      }//end if
    }
    return false;
  },
}

var FetchSingleBookMixin = {
  fetchSingle: function(bookID) {
    $.ajax({
      url: "/api/books/" + bookID,
      success: function(book) {
        this.setState({book: book});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
}

var RouterMixin = {
  callback: function() {
    if(this.dataCallback) {
      this.dataCallback();
    }
    this.viewCallback();
  },

  viewCallback: function() {
    if(this.props.router.action == this.action) {
      this.setState({cssClass: "animate-enter animate-enter-active"}); 
    } else {
      this.setState({cssClass: "animate-leave animate-leave-active"}); 
    }//end else
  },

  componentWillMount : function() {
    this.props.router.on("route", this.callback);
  },

  componentWillUnmount : function() {
    this.props.router.off("route", this.callback);
  },

};
 
var IndexComponent = React.createClass({
  mixins : [RouterMixin, LinkHandlerMixin],
  action : "index",
  getInitialState: function() {
    return { cssClass: "animate-leave animate-leave-active", books: [] };
  },
  dataCallback: function() {
    this.fetch();
  },

  fetch  : function() {
    $.ajax({
      url: "/api/books",
      success: function(books) {
        this.setState({books: books});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render : function() {
    return (
      <div className={this.state.cssClass}>
        <div>
          <div style={{"text-align": "right", "padding-right": "10px"}}>
            <a onClick={this.handleLinkClicked} href='/books/new' className="btn btn-primary">+ New Book</a>
          </div>
          <BookListView data={this.state.books} router={this.props.router}/>
          <br/>
        </div>
      </div>
    );
  }
});

var BookFormView = React.createClass({
  mixins: [LinkHandlerMixin],
  getInitialState: function() {
    return {cssClass: "animate-leave animate-leave-active", book: { name: "", author: "", description: ""}};
  },

  componentWillReceiveProps: function(nextProps) {
    if(nextProps.book) {
      this.setState({book: nextProps.book});
    }//end if
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var submittedBook = $.extend({}, this.state.book);
    delete(submittedBook.id);
    $.ajax({
      type: this.props.formMethod,
      url: "/api/books" + (this.state.book.id ? "/" + this.state.book.id : ""),
      data: {"book": submittedBook}, 
      success: function() {
        this.props.router.navigate("/books/index", {
          trigger : true
        });
      }.bind(this)
    });
    return false;
  },

  onNameChange: function(e) {
    var book = this.state.book;
    book.name = $(e.target).val();
    this.setState({book: book})
  },

  onDescriptionChange: function(e) {
    var book = this.state.book;
    book.description = $(e.target).val();
    this.setState({book: book})
  },
 
  onAuthorChange: function(e) {
    var book = this.state.book;
    book.author = $(e.target).val();
    this.setState({book: book})
  }, 

  render: function() {
    return (
      <form method="post" enctype="multipart/form-data" onSubmit={this.handleSubmit}>
        <input type="hidden" name="_method" value={this.state.method} />

        <div className="form-group">
          <label for="name">Name</label>
          <input type="text" name="name" className="form-control" value={this.state.book.name} onChange={this.onNameChange}/>
        </div>
        
        <div className="form-group">
          <label for="name">Author</label>
          <input type="text" name="author" className="form-control" value={this.state.book.author} onChange={this.onAuthorChange}/>
        </div>
        
        <div className="form-group">
          <label for="description">Description</label>
          <textarea name="description" className="form-control" onChange={this.onDescriptionChange} value={this.state.book.description}></textarea>
        </div>
        
        <button type="submit" className="btn btn-primary">Save</button>
        &nbsp;&nbsp;or&nbsp;
        <a href='/books' onClick={this.handleLinkClicked}>Cancel</a>
      </form>
    );
  }
});

var BookListView = React.createClass({
  onDelete: function(component, event) {
    event.preventDefault();
    var deletedBook = component.props.book;
    var indexOfDeletedBook = this.props.data.indexOf(deletedBook);
    var confirm = window.confirm("Are you sure that you want to delete this book?");
    if(confirm) {
      if(indexOfDeletedBook != -1) {
        this.props.data.splice(indexOfDeletedBook, 1);  
      }//end if
      this.handleDelete(deletedBook.id);
      this.forceUpdate();
    }//end if
  },

  handleDelete: function(deletedBookId) {
    $.ajax({
      type: "DELETE",
      url: "/api/books/" + deletedBookId,
      success: function() {
      }.bind(this)
    });
  },

  render: function() {
    var books = this.props.data.map(function(data) {
      return (
        <BookListEntryView book={data} router={this.props.router} onDelete={this.onDelete} />
      );
    }.bind(this));
    return (
      <div className="table-responsive">
        <table className='table table-striped books-list'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Author</th>
              <th style={{"width": "210px;"}}></th>
            </tr>
          </thead>
          <tbody>
            {books} 
          </tbody>
        </table>
      </div>
    );    
  }
});

var BookListEntryView = React.createClass({
  mixins: [LinkHandlerMixin],
  render: function() {
    return (
      <tr>
        <td>{this.props.book.name}</td>
        <td>{this.props.book.description}</td>
        <td>{this.props.book.author}</td>
        <td>
          <a href={"/books/" + this.props.book.id}  className='btn btn-success' onClick={this.handleLinkClicked}>Show</a>
          &nbsp;
          <a href={"/books/" + this.props.book.id + "/edit"} className='btn btn-primary' onClick={this.handleLinkClicked}>Edit</a>
          &nbsp;
          <a href={"/api/books/" + this.props.book.id} className='btn btn-danger' data-method="DELETE" data-confirm="Are you sure?" data-redirect-to="/books" onClick={this.props.onDelete.bind(null, this)}>Delete</a>
          &nbsp;
        </td>
      </tr>
    ) 
  }
}); 

var EditComponent = React.createClass({
  mixins: [RouterMixin, LinkHandlerMixin, FetchSingleBookMixin],
  action: "edit",
  getInitialState: function() {
    return { cssClass: "animate-leave animate-leave-active", book: {}};
  },

  dataCallback: function() {
    if(this.props.router.id) {
      this.fetchSingle(this.props.router.id);
    }//end if
  },

  render: function() {
    return (
      <div className={this.state.cssClass}>
        <div>
          <h2>Edit Book</h2>
          <br/>
          <BookFormView formMethod="PATCH" router={this.props.router} book={this.state.book} />
        </div>
      </div>
    );
  }
});

var NewComponent = React.createClass({
  mixins: [RouterMixin, LinkHandlerMixin],
  action: "new",
  getInitialState: function() {
    return { cssClass: "animate-leave animate-leave-active"};
  },

  render: function() {
    return (
      <div className={this.state.cssClass}>
        <div>
          <h2>New Book</h2>
          <br/>
          <BookFormView formMethod="POST" router={this.props.router} />
        </div>
      </div>
    );
  }
});

var ShowComponent = React.createClass({
  mixins: [RouterMixin, LinkHandlerMixin, FetchSingleBookMixin],
  action: "show",
  getInitialState: function() {
    return { cssClass: "animate-leave animate-leave-active", book: {}};
  },
  
  dataCallback: function() {
    if(this.props.router.id) {
      this.fetchSingle(this.props.router.id);
    }//end if
  },

  render: function() {
    return (
      <div className={this.state.cssClass}>
        <div>
          <h2>Book {this.state.book.name}</h2>
          <span className='author'>{this.state.book.author}</span>
          <br/><br/>
          <p>
            {this.state.book.description}
          </p>
          <a href={"/books/" + this.state.book.id + "/edit"} className='btn btn-primary' onClick={this.handleLinkClicked}>Edit</a>
          &nbsp;
          <a href={"/api/books/" + this.state.book.id} className='btn btn-danger' onClick={this.handleLinkClicked} data-method="DELETE" data-confirm="Are you sure?" data-redirect-to="/books">Remove</a>
        </div>
      </div>
    );
  }
});

var NavigationBar = React.createClass({
  mixins: [LinkHandlerMixin],
  render: function() {
  return (
    <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
       <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" 
                    className="navbar-toggle" 
                    data-toggle="collapse" 
                    data-target=".navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/" onClick={this.handleLinkClicked}>Book Store</a>
          </div>
        </div>
      </div> 
    );
  }
});

var InterfaceComponent = React.createClass({
  mixins : [RouterMixin, LinkHandlerMixin],
  render : function() {
    var router = this.props.router;
    return (
      <div>
        <IndexComponent router={router} />
        <EditComponent  router={router} />
        <NewComponent   router={router} />
        <ShowComponent  router={router} />
      </div>
    );
  }
});
 
var Router = Backbone.Router.extend({
  routes : {
    ""               : "indexAction",
    "books"          : "indexAction",
    "books/index"    : "indexAction",
    "books/new"      : "newAction",
    "books/:id/edit" : "editAction",
    "books/:id"      : "showAction"
  },

  indexAction: function() {
    this.action = "index";    
  },

  editAction: function(id) {
    this.action = "edit";
    this.id = id;
  },

  showAction: function(id) {
    this.action = "show";
    this.id = id;
  },

  newAction: function() {
    this.action = "new";
  }
});
 
var router = new Router();

React.renderComponent(
  <InterfaceComponent router={router} />,
  document.getElementById("content")
);

React.renderComponent(
  <NavigationBar router={router} />,
  document.getElementById("navigation")
);

Backbone.history.start({pushState: true});
