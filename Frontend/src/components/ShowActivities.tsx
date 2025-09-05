import Select from 'react-select'
import React, { useState } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap'

import type { Option, Activity } from '../types'

interface Props {
  city: string
  activities: Activity[]
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>
}

const ShowWActivities = ({ city, activities, setActivities }: Props) => {
  const [activity, setActivity] = useState<Option | null>(null)
  const baseUrl = 'http://localhost:3003/'

  const options: Array<Option> = [
    { value: 'museums', label: 'museums' },
    { value: 'restaurants', label: 'restaurants' },
    { value: 'supermarkets', label: 'supermarkets' },
    { value: 'parks', label: 'parks' },
  ]

  const handleActivity = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (activity) {
      const response = await axios.get(baseUrl + `activities/?city=${city}&activity=${activity.value}`)
      setActivities(response.data.activities)
    }
  }

  const showName = (activity: Activity) => {
    if (activity.type === 'supermarket' || activity.type === 'park') {
      return (
        <div className="my-3">
          {activity.suburb
            ? (
                <h5>
                  {activity.name}
                  {' '}
                  {activity.suburb}
                </h5>
              )
            : <h5>{activity.name}</h5>}
        </div>
      )
    }
    else {
      return (
        <div className="my-3">
          <h5>{activity.name}</h5>
        </div>
      )
    }
  }

  const showDetails = (activity: Activity) => {
    if (activity.type === 'museum' || activity.type === 'supermarket') {
      return (
        activity.openingHours
          ? <p>{activity.openingHours}</p>
          : null
      )
    }
    else if (activity.type === 'restaurant' && activity.cuisine) {
      return (
        activity.website
          ? (
              <>
                <p>
                  website:
                  <a href={activity.website}>
                    {activity.website}
                    {' '}
                  </a>
                </p>
                <p>
                  cuisine:
                  {activity.cuisine}
                </p>
              </>
            )
          : <p>{activity.cuisine}</p>
      )
    }
    else if (activity.type === 'restaurant' && activity.website) {
      return (
        <p>
          website:
          <a href={activity.website}>
            {activity.website}
            {' '}
          </a>
        </p>
      )
    }
  }

  return (
    <div className="mt-4">
      <h4>Find nearby</h4>
      <Select<Option>
        value={activity}
        onChange={option => setActivity(option)}
        options={options}
      />
      <Button className="my-1" onClick={handleActivity}>Find</Button>
      {activities
        ? activities.map((a) => {
            return (
              <div className="my-4" key={a.id}>
                {showName(a)}
                <p>{a.address}</p>
                {showDetails(a)}
              </div>
            )
          })
        : null}
    </div>
  )
}

export default ShowWActivities
