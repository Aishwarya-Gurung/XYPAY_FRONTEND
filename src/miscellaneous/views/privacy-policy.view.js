import React from 'react';

import { PAGE } from 'app';
import { PageHead } from 'components/layout/page-head';

const PrivacyPolicyView = () => {
  return (
    <div className="cityscape">
      <PageHead title={PAGE.PRIVACY_POLICY} />
      <section className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-justify mt-5 md-5 mb-5">
            <div className="text-muted">
              <h3 className="text-center bold">Privacy Policy</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                ac ultrices justo. Morbi tristique felis eget ante dapibus, a
                lobortis leo commodo. Vivamus bibendum nibh a libero tincidunt,
                vel vehicula neque varius. Fusce quis ligula ac quam blandit
                aliquet. Duis ultricies risus at luctus lobortis. Suspendisse
                potenti. Ut malesuada ipsum vel magna dictum, quis varius nisl
                dapibus. Phasellus sed eros sagittis, consequat libero ac,
                eleifend mi. Vestibulum sit amet mattis leo. Nam sagittis lectus
                vel mauris eleifend, et ultrices felis commodo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyView;
