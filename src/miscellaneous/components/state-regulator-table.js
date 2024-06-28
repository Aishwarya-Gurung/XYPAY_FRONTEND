import React from 'react';
import PropTypes from 'prop-types';

import { PAGE } from 'app';
import { PageHead } from 'components/layout/page-head';

const STATE_REGULATORS = [
  {
    state: 'Alabama',
    licenseNo: 'SC 520',
    contactInfo: [
      'Alabama Securities Commission',
      '445 Dexter Avenue, Suite 12000',
      'Montgomery, Alabama 36104',
      'Telephone: 334-242-2984 / 1-800-222-1253',
      'Email: asc@asc.alabama.gov',
    ],
  },
  {
    state: 'Alaska',
    licenseNo: 'AK- MT-10093',
    contactInfo: [
      'Division of Banking and Securities',
      'PO Box 110807',
      'Juneau, AK 99811-0807',
      'Telephone: 907-465-2521/ 1-888-925-2521',
      'Email: dbsc@alaska.gov',
    ],
  },
  {
    state: 'Arkansas',
    licenseNo: '43394',
    contactInfo: [
      'Arkansas Securities Department',
      'Heritage West Building, Suite 300',
      '201 East Markham Street',
      'Little Rock, Arkansas 72201-1692',
      'Telephone: 501-324-9260',
      'Website: http://www.securities.arkansas.gov',
    ],
  },
  {
    state: 'Connecticut',
    licenseNo: 'MT/916876',
    contactInfo: [
      'Connecticut Department of Banking Consumer Credit Division',
      '260 Constitution Plaza, Hartford, CT 06103-1800',
      'Telephone Number: 1-860-240-8200 (toll free)',
      'Fax Number: 860-240-8215',
      'Website: http://www.ct.gov/dob',
    ],
  },
  {
    state: 'California',
    licenseNo: '2401',
    contactInfo: [
      'California Department of Business Oversight',
      '1515 K Street Suite 200 Sacramento, CA 95814 ',
      'Telephone: 916-327-7585 (toll free) ',
      'Fax Number: (415) 288-8830 ',
      'Website: http://www.dbo.ca.gov/',
    ],
  },
  {
    state: 'Colorado',
    licenseNo: '500181',
    contactInfo: [
      'Colorado Division of Banking ',
      '1560 Broadway, Suite 975',
      'Denver, CO 80202',
      'Telephone: 303-894-7575',
      'Website: http://www.colorado.gov',
    ],
  },
  {
    state: 'Delaware',
    licenseNo: '019826',
    contactInfo: [
      'Office of the State Bank Commissioner',
      '1110 Forrest Avenue',
      'Dover, DE  19904',
      'Telephone: 302-739-4235',
      'Website: http://www.banking.delaware.gov',
    ],
  },
  {
    state: 'District of Columbia',
    licenseNo: 'MTR916878',
    contactInfo: [
      'DC Department of Insurance, Securities and Banking',
      'Securities Bureau',
      'Wells Fargo Bank',
      '7175 Columbia Gateway Drive',
      'Lockbox #92660',
      'Columbia. MD 21046',
      'Telephone: 202-442-7826',
      'Website: http://www.disb.dc.gov',
    ],
  },
  {
    state: 'Florida',
    licenseNo: 'FT230000009',
    contactInfo: [
      'Florida Office of Financial Regulation ',
      'Division of Consumer Finance Consumer Assistance Group',
      '200 E. Gaines Street, Tallahassee, FL 32399-0381 ',
      'Telephone: 1-850-410-9805 ',
      'Fax Number: 850-410-9300 ',
      'Website: http://www.flofr.com',
    ],
  },
  {
    state: 'Georgia',
    licenseNo: '26269',
    contactInfo: [
      'Georgia Department of Banking and Finance',
      '2990 Brandywine Road, Suite 200, Atlanta, Georgia 30341',
      'Telephone: 1-770-986-1633',
      'Fax Number: 850-410-9300',
      'Website: http://www.dbf.georgia.gov',
    ],
  },
  {
    state: 'Idaho',
    licenseNo: 'MTL-168',
    contactInfo: [
      'Idaho Department of Finance',
      'P.O. Box 83720',
      'Boise, ID 83720-0031',
      'Telephone: 208-332-8000  / 1-888-346-3378',
      'Website: http://www.finance.idaho.gov',
    ],
  },
  {
    state: 'Illinois',
    licenseNo: 'MT0000195',
    contactInfo: [
      'Department of Financial and Professional Regulation',
      'Division of Financial Institutions',
      '320 W Washington Suite 550, Springfield, IL 62786',
      'Telephone: 1-800-560-6420',
      'Fax Number: 217-782-7645',
      'Website: http://www.idfpr.com',
    ],
  },
  {
    state: 'Maryland',
    licenseNo: '916876',
    contactInfo: [
      'Maryland Office of the Commissioner of Financial Regulation',
      '500 N. Calvert Street, Suite 402',
      'Baltimore, Maryland 21202',
      'Telephone: 410-230-6100 or 888-784-0136',
      'Website: http://www.dllr.state.md.us',
    ],
  },
  {
    state: 'Massachusetts',
    licenseNo: '-',
    contactInfo: [
      'Massachusetts Division of Banks',
      'Consumer Assistance Office',
      '1000 Washington Street, 10th floor, Boston, MA 02118-2218',
      'Telephone: 1-617-956-1500 ext. 501',
      'Fax Number: 617-368-2700',
      'Website: http://www.mass.gov/ocabr/government/oca-agencies/dob-lp/',
    ],
  },
  {
    state: 'Minnesota',
    licenseNo: 'MN-MT-916876',
    contactInfo: [
      'Minnesota Department of Commerce',
      'Main Office, Golden Rule Building',
      '85 7th Place East',
      'Suite 280',
      'Saint Paul, Minnesota 55101',
      'Telephone: 651-539-1500 (local) /651-539-1600 (complaints)/1-800-657-3602 (Greater MN only)',
      'Email: consumer.protection@state.mn.us',
      'Website: https://mn.gov/portal/',
    ],
  },
  {
    state: 'Missouri',
    licenseNo: 'MO-19-7508',
    contactInfo: [
      'Missouri Division of Finance',
      'Truman State Office Building',
      'Room 630',
      'Jefferson City, MO 65102',
      'Telephone: 573-751-3242',
      'Fax Number: (573) 751-9192',
      'Email: finance@dof.mo.gov',
      'Website: https://finance.mo.gov/contact/',
    ],
  },
  {
    state: 'Montana',
    licenseNo: '-',
    contactInfo: [
      'Montana Department of Administration',
      'Banking and Financial Institutions',
      'PO Box 200546',
      'Helena MT 59620',
      'Telephone: 406-841-2920',
      'Fax Number: 406-841-2930',
      'Email: banking@mt.gov',
    ],
  },
  {
    state: 'Nevada',
    licenseNo: 'MT60045',
    contactInfo: [
      'Financial Institution Division, Department of Business and Industry',
      '3300 W Sahara Avenue Suite 250, Las Vegas, NV 89102',
      'Telephone: 702-486-4120 (toll free)',
      'Fax Number: (702) 486 – 4563',
      'Website: http://www.fid.nv.gov/',
    ],
  },
  {
    state: 'New Jersey',
    licenseNo: 'L069442',
    contactInfo: [
      'New Jersey Department of Banking and Insurance ',
      'P.O. Box 471, Trenton, NJ 08625-0471',
      'Telephone: 1-800-446-7467',
      'Fax Number: 609-777-0508',
      'Website: http://www.state.nj.us/dobi',
    ],
  },
  {
    state: 'New Mexico',
    licenseNo: '916876',
    contactInfo: [
      'New Mexico Financial Institution Division',
      'PO Box 25101',
      'Santa Fe, New Mexico 87504',
      'Telephone: 505-476-4885',
      'Website: http://www.rld.state.nm.us/',
    ],
  },
  {
    state: 'North Carolina',
    licenseNo: '161676',
    contactInfo: [
      'North Carolina Commissioner of Banks',
      '316 W. Edenton St.,',
      'Raleigh, NC 27603',
      'Telephone: 919-733-3016',
      'Website: http://www.nccob.gov',
    ],
  },
  {
    state: 'North Dakota',
    licenseNo: 'MT102775',
    contactInfo: [
      'North Dakota Department of Financial Institutions',
      '2000 Schafer Street, Suite G',
      'Bismarck, ND 58501-1204',
      'Telephone: 701.328.9933',
      'Website: http://www.nd.gov',
    ],
  },

  {
    state: 'Oregon',
    licenseNo: 'MTX-30103',
    contactInfo: [
      'Oregon Division of Financial Regulation',
      '350 Winter St. NE',
      'Room 410',
      'PO Box 14480',
      'Salem, OR 97309',
      'Telephone: 503-378-4140/888-877-4894',
      'Website: https://dfr.oregon.gov',
    ],
  },
  {
    state: 'South Dakota',
    licenseNo: 'MT 2050',
    contactInfo: [
      'South Dakota Division of Banking',
      '123 W. Missouri Ave. - Pierre, SD 57501',
      'Telephone: 605.773.3101',
      'Website: http://www.dlr.sd.gov',
    ],
  },
  {
    state: 'Tennessee',
    licenseNo: '136',
    contactInfo: [
      'Tennessee Department of Financial Institutions',
      '312 Rosa L. Parks Avenue,',
      '26th Floor Nashville, TN 37243',
      'Telephone: 615-741-2236',
      'Email: TDFI.Contact@tn.gov',
      'Website: http://www.tn.gov',
    ],
  },
  {
    state: 'Texas',
    licenseNo: '3057',
    contactInfo: [
      'Texas Department of Banking',
      '2601 North Lamar Boulevard Suite 300, Austin, TX 78705-4294',
      'Telephone: 1-877-276-5554 (toll free)',
      'Fax Number: 512-475-1313',
      'Email: consumer.complaints@dob.texas.gov',
      'Website: http://www.dob.texas.gov',
    ],
  },
  {
    state: 'Utah',
    licenseNo: '115',
    contactInfo: [
      'Utah Department of Financial Institutions',
      'P.O. Box 146800',
      'Salt Lake City, Utah 84114-6800',
      'Telephone: 801-538 – 8830',
      'Email: dfi@utah.gov',
      'Website: http://www.dfi.utah.gov',
    ],
  },
  {
    state: 'Virginia',
    licenseNo: 'MO- 249',
    contactInfo: [
      'Virginia Bureau of Financial Institutions',
      '1300 East Main Street,',
      'Suite 800, Po Box 640,',
      'Richmond, Virginia 23218-0640',
      'Telephone: 804-371-9657',
      'Website: http://www.scc.virginia.gov',
    ],
  },
  {
    state: 'Washington',
    licenseNo: '550-MT-57144',
    contactInfo: [
      'Washington Department of Financial Institutions',
      '150 Israel Rd SW',
      'Tumwater WA 98501',
      'Telephone: 360-902-8700 / 1-877-RING DFI (746-4334)',
      'Website: http://www.dfi.wa.gov',
    ],
  },
];

const StateRegulatorTable = (props) => {
  const { showLicense } = props;

  return (
    <React.Fragment>
      {!showLicense ? <ContactInfo /> : <PageHead title={PAGE.GMT_LICENSING} />}

      <table className="table m-0">
        <thead className="text-center">
          <tr>
            <th>STATE</th>
            {showLicense && <th>LICENSE NO</th>}
            <th>CONTACT INFORMATION</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {STATE_REGULATORS.map((regulator, key) => (
            <tr key={key}>
              <td>{regulator.state}</td>
              {showLicense && <td>{regulator.licenseNo}</td>}
              <td>
                <ul className="list-unstyled">
                  {regulator.contactInfo.map((info, key2) => (
                    <li key={key2}>
                      <Info info={info} />
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

const isWebsite = (data) => {
  if (data.slice(0, 7).toLowerCase() === 'website') {
    return data.slice(9, data.length);
  }

  return false;
};

const isEmail = (data) => {
  if (data.slice(0, 5).toLowerCase() === 'email') {
    return data.slice(7, data.length);
  }

  return false;
};

const Info = (props) => {
  const email = isEmail(props.info);
  const website = isWebsite(props.info);

  return website ? (
    <React.Fragment>
      Website:{' '}
      <a href={website} target="_blank" rel="noopener noreferrer">
        {website}
      </a>
    </React.Fragment>
  ) : (
    <React.Fragment>
      {email ? (
        <React.Fragment>
          Email:{' '}
          <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
            {email}
          </a>
        </React.Fragment>
      ) : (
        <span>{props.info}</span>
      )}
    </React.Fragment>
  );
};

Info.propTypes = {
  info: PropTypes.string,
};

const ContactInfo = () => (
  <React.Fragment>
    <h6 className="text-capitalize bold">Contact Us:</h6>
    <ul className="list-unstyled">
      <li className="text-capitalize bold">XYPAY LLC</li>
      <li>1900 21St Avenue South</li>
      <li>Birmingham, AL 35209</li>
      <li>Tel: 1-866-743-9422</li>
      <li>
        Email:{' '}
        <a
          href="mailto:info@gmtsend.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          customer_service@XYPAY.com
        </a>
      </li>
      <br />
      <li className="text-capitalize bold">Golden Money Transfer</li>
      <li>739 Fourth Ave #204, San Diego, CA 92101</li>
      <li>Tel: 1-888-702-5656</li>
      <li>
        Email:{' '}
        <a
          href="mailto:info@gmtsend.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          info@gmtsend.com
        </a>
      </li>
    </ul>
    <br />
    <p className="text-capitalize bold text-muted">STATE REGULATORS</p>
  </React.Fragment>
);

StateRegulatorTable.propTypes = {
  showLicense: PropTypes.bool,
};

export default StateRegulatorTable;
