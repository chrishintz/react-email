var React = require("react");
var ReactDOM = require("react-dom");

var Email = React.createClass({
  setCurrentEmail: function (email) {
    this.setState({currentEmail: email, isFormShowing: false});
  },
  componentDidMount: function () {
    var pineapple = this;
    $.ajax("/emails").then(function(emails) {
      pineapple.setState({emails: emails});
    });
  },
  getInitialState: function() {
    return {emails: [], currentEmail: null, isFormShowing: false}
  },
  showForm: function () {
    this.setState({isFormShowing: true});
  },
  createEmail: function(newEmail) {
    var that = this;
    $.post("/emails", {email: newEmail}).then(function(email) {
      var updatedEmails = that.state.emails;
      updatedEmails.push(email);
      that.setState({emails: updatedEmails, currentEmail: email, isFormShowing: false});
    }, function(data) {
      console.log(data);
    });
  },
  render: function() {
    var main;
    if (this.state.isFormShowing) {
      main = <EmailForm createEmail={this.createEmail}/>
    } else {
      main = <EmailPreview showForm={this.showForm} email={this.state.currentEmail}/>;
    }
    return(
      <div>
        <EmailList handleClick={this.setCurrentEmail} emails={this.state.emails}/>
        {main}
      </div>
    )
  }
});

var EmailForm = React.createClass({
  getInitialState: function() {
    return {to: null, subject: null, body: null, from: "Chris"}
  },
  setInput: function(event) {
    var newState = {}
    newState[event.target.name] = event.target.value
    this.setState(newState)
  },
  submit: function(event) {
    event.preventDefault();
    this.props.createEmail(this.state)
  },
  render: function() {
    return(
      <form onSubmit={this.submit}>
        <div>
          <label>To: </label><br/>
          <input onChange={this.setInput} type="text" name="to" />
        </div>
        <div>
          <label>Subject: </label><br/>
          <input onChange={this.setInput} type="text" name="subject" />
        </div>
        <div>
          <label>Body: </label><br/>
          <textarea onChange={this.setInput} type="text" name="body"/>
        </div>
        <input type="submit" value="Send Email" />
      </form>
    )
  }
})

var EmailPreview = React.createClass({
  render: function() {
    var body;
    if (this.props.email) {
      body = (
      <div>
        <h1>{this.props.email.subject}</h1>
        <p>{this.props.email.body}</p>
        <small>
          From: {this.props.email.from} To: {this.props.email.to}
        </small>
      </div>
      )
    } else {
      body = <h1>...</h1>
    }
    return (
      <div className='email-preview'>
        {body}
        <button onClick={this.props.showForm}>+</button>
      </div>
    )
  }
});

var EmailList = React.createClass({
  render: function() {
    var emailDivs = [];

    for (var i = 0; i < this.props.emails.length; i++) {
      emailDivs.push(<EmailListItem handleClick={this.props.handleClick} key={i} email={this.props.emails[i]} />);
    }

    return(
      <div className="email-list">
        {emailDivs}
      </div>
    )
  }
});

var EmailListItem = React.createClass({
  showEmail: function() {
    this.props.handleClick(this.props.email);
  },
  render: function() {
    return(
      <div onClick={this.showEmail} className="email-list-item">
        <h2>{this.props.email.subject}</h2>
        <p>{this.props.email.body.substring(0,40)}</p>
        <small>
          To: {this.props.email.to} From: {this.props.email.from}
        </small>
      </div>
    )
  }
});

ReactDOM.render(<Email />, document.getElementById("email"))
