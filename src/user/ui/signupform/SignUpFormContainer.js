import {drizzleConnect} from "drizzle-react";
import SignUpForm from './SignUpForm'
import { signUpUser } from './SignUpFormActions'

const mapStateToProps = (state, ownProps) => {
  return {}
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignUpFormSubmit: (name) => {
      dispatch(signUpUser(name))
    }
  }
};

const SignUpFormContainer = drizzleConnect(SignUpForm, mapStateToProps, mapDispatchToProps);

export default SignUpFormContainer
