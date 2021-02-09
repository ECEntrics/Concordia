import React, { useMemo } from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { USER_PROFILE_PICTURE } from '../constants/orbit/UserDatabaseKeys';

const ProfileImage = (props) => {
  const {
    topicAuthorAddress, topicAuthor, topicAuthorMeta, avatarUrl, size, link,
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
          name={topicAuthor}
          size={size}
          round
          src={profileImageUrl}
        />
    );
  }, [avatarUrl, size, topicAuthor, topicAuthorMeta]);

  return useMemo(() => {
    if (link && topicAuthorAddress) {
      return (
          <Link to={`/users/${topicAuthorAddress}`} onClick={stopClickPropagation}>
              {authorAvatar}
          </Link>
      );
    }
    return authorAvatar;
  }, [authorAvatar, link, topicAuthorAddress]);
};

ProfileImage.propTypes = {
  topicAuthorAddress: PropTypes.string,
  topicAuthor: PropTypes.string,
  topicAuthorMeta: PropTypes.shape({ id: PropTypes.string, profile_picture: PropTypes.string }),
  avatarUrl: PropTypes.string,
  size: PropTypes.string,
  link: PropTypes.bool,
};

export default ProfileImage;
