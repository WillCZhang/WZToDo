import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
// import { history } from '../_helpers';
import { PrivateRoute } from './components/privateRoutes';
import Todo from './components/todo';
import LoginPage from './components/login';
import RegisterPage from './components/register';
import { history } from './components/history';

class App extends React.Component {
    render() {
        const { alert } = this.props;
        return (
            <div className="jumbotron">
                <div className="container">
                    <div>
                        {alert.message &&
                            <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
                        <Router history={history}>
                            <div>
                                <PrivateRoute exact path="/" component={Todo} />
                                <Route path="/login" component={LoginPage} />
                                <Route path="/register" component={RegisterPage} />
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        alert: state
    };
}

export default connect(mapStateToProps)(App);