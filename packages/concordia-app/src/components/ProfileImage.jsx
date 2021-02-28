import React, { useMemo } from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { USER_PROFILE_PICTURE } from '../constants/orbit/UserDatabaseKeys';

const ProfileImage = (props) => {
  const {
    profileAddress, profileUsername, topicAuthorMeta, avatarUrl, size, link,
  } = props;

  const stopClickPropagation = (event) => {
    event.stopPropagation();
  };

  const authorAvatar = useMemo(() => {
    let profileImageUrl = '';
    if (avatarUrl) profileImageUrl = avatarUrl;
    else if (topicAuthorMeta && topicAuthorMeta[USER_PROFILE_PICTURE]) profileImageUrl = topicAuthorMeta[USER_PROFILE_PICTURE];

    return (
        <Avatar
          name={profileUsername}
          size={size}
          round
          src={profileImageUrl}
        />
    );
  }, [avatarUrl, size, profileUsername, topicAuthorMeta]);

  return useMemo(() => {
    if (link && profileAddress) {
      return (
          <Link to={`/users/${profileAddress}`} onClick={stopClickPropagation}>
              {authorAvatar}
          </Link>
      );
    }
    return authorAvatar;
  }, [authorAvatar, link, profileAddress]);
};

ProfileImage.propTypes = {
  profileAddress: PropTypes.string,
  profileUsername: PropTypes.string,
  profileUserMeta: PropTypes.shape({ id: PropTypes.string, profile_picture: PropTypes.string }),
  avatarUrl: PropTypes.string,
  size: PropTypes.string,
  link: PropTypes.bool,
};

export default ProfileImage;
