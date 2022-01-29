import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Dimmer, Loader, Placeholder, Tab,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const CustomLoadingTabPane = (props) => {
  const { loading, loadingMessage, children } = props;
  const { t } = useTranslation();

  return useMemo(() => {
    if (loading) {
      return (
          <Tab.Pane>
              <Dimmer active inverted>
                  <Loader inverted>
                      {loadingMessage !== undefined
                        ? loadingMessage
                        : t('custom.loading.tab.pane.default.generic.message')}
                  </Loader>
              </Dimmer>
              <Placeholder fluid>
                  <Placeholder.Line length="very long" />
                  <Placeholder.Line length="medium" />
                  <Placeholder.Line length="long" />
              </Placeholder>
          </Tab.Pane>
      );
    }

    return (
        <Tab.Pane>
            {children}
        </Tab.Pane>
    );
  }, [children, loading, loadingMessage, t]);
};

CustomLoadingTabPane.propTypes = {
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  children: PropTypes.element,
};

export default CustomLoadingTabPane;
