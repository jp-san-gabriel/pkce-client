import React, {Component} from 'react';
import {connect} from 'react-redux';
import get_users from '../actions/get_users';

class UserList extends Component {

    componentDidMount() {
        this.props.get_users();
    }

    render() {
        return this.props.userList.map(user => (
            <div key={user.email}>
                <p>Username: {user.username}<br/>
                email: {user.email}</p>
            </div>
        ));
    }
}

const mapStateToProps = ({userList}) => { return {userList} };

export default connect(mapStateToProps, {get_users})(UserList);