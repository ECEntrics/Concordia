import { drizzleConnect } from 'drizzle-react'

import ProfileForm from './ProfileForm'
import { updateUser } from './ProfileFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    name: state.user.data.name
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onProfileFormSubmit: (name, event) => {
      event.preventDefault();
      dispatch(updateUser(name))
    }
  }
};

const ProfileFormContainer = drizzleConnect(ProfileForm, mapStateToProps, mapDispatchToProps);

export default ProfileFormContainer
