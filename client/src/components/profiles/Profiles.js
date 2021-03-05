import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner'
import {getProfiles} from '../../actions/profile';
import ProfileItem  from './ProfileItem';
import {connect} from 'react-redux';

const Profiles = ({getProfiles, profile: {profiles, loading}}) => {
 useEffect(() => {
     getProfiles()
 }, [getProfiles])
 
 
    return (
       <>
            {loading? <Spinner /> :
            <>
                <h1 className="large text-primary">Developers</h1>
                <p className="lead">
                    browse and connect with develpers
                </p>
                <div className="profiles">
                    {profiles.length > 0 ? (
                        profiles.map(profile => (
                            <ProfileItem key={profile._id} profile={profile} />
                        ))
                    ) : <h4> No profiles found</h4>}
                </div>
            </> }
       </>
    )
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile:PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, {getProfiles})(Profiles)
