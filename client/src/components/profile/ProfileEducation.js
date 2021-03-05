import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileEducation = ({
    education: {company, title, location, current, to, from, description}
}) => {

    return (
        <div>
            <h3 className="text-dark">{company}</h3>
            <p>
                <Moment format="YYYY/MM/DD">{from}</Moment> - {!to ? ' Now' :  <Moment format="YYYY/MM/DD">{to}</Moment> }
            </p>
            <p>
                <strong>Position:</strong> {title}
            </p>
            <p>
            <strong>Desc:</strong> {description}
            </p>
            
        </div>
    )
}

ProfileEducation.propTypes = {

}

export default ProfileEducation
