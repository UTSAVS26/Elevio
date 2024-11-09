import React, { useState } from 'react'

const Button = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
  >
    {children}
  </button>
)

const Input = ({ id, type, placeholder, value, onChange }) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
)

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
)

const RadioGroup = ({ value, onChange, children }) => (
  <div className="space-y-2">{children}</div>
)

const RadioGroupItem = ({ id, name, value, checked, onChange }) => (
  <input
    type="radio"
    id={id}
    name={name}
    value={value}
    checked={checked}
    onChange={onChange}
    className="mr-2"
  />
)

export default function FitnessProfile() {
  const [page, setPage] = useState(0)
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    fitnessGoal: '',
    preferredWorkout: '',
  })

  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const questions = [
    {
      field: 'name',
      question: 'What is your name?',
      type: 'input',
      placeholder: 'Enter your name',
    },
    {
      field: 'age',
      question: 'How old are you?',
      type: 'input',
      inputType: 'number',
      placeholder: 'Enter your age',
    },
    {
      field: 'gender',
      question: 'What is your gender?',
      type: 'radio',
      options: [
        { value: 'male', label: 'Male', image: '/placeholder.svg?height=100&width=100' },
        { value: 'female', label: 'Female', image: '/placeholder.svg?height=100&width=100' },
        { value: 'other', label: 'Other', image: '/placeholder.svg?height=100&width=100' },
      ],
    },
    {
      field: 'height',
      question: 'What is your height (in cm)?',
      type: 'input',
      inputType: 'number',
      placeholder: 'Enter your height in cm',
    },
    {
      field: 'weight',
      question: 'What is your weight (in kg)?',
      type: 'input',
      inputType: 'number',
      placeholder: 'Enter your weight in kg',
    },
    {
      field: 'activityLevel',
      question: 'What is your activity level?',
      type: 'radio',
      options: [
        { value: 'sedentary', label: 'Sedentary', image: '/placeholder.svg?height=100&width=100' },
        { value: 'light', label: 'Lightly Active', image: '/placeholder.svg?height=100&width=100' },
        { value: 'moderate', label: 'Moderately Active', image: '/placeholder.svg?height=100&width=100' },
        { value: 'very', label: 'Very Active', image: '/placeholder.svg?height=100&width=100' },
        { value: 'extra', label: 'Extra Active', image: '/placeholder.svg?height=100&width=100' },
      ],
    },
    {
      field: 'fitnessGoal',
      question: 'What is your primary fitness goal?',
      type: 'radio',
      options: [
        { value: 'lose-weight', label: 'Lose Weight', image: '/placeholder.svg?height=100&width=100' },
        { value: 'build-muscle', label: 'Build Muscle', image: '/placeholder.svg?height=100&width=100' },
        { value: 'improve-endurance', label: 'Improve Endurance', image: '/placeholder.svg?height=100&width=100' },
        { value: 'maintain-health', label: 'Maintain Overall Health', image: '/placeholder.svg?height=100&width=100' },
      ],
    },
    {
      field: 'preferredWorkout',
      question: 'What is your preferred type of workout?',
      type: 'radio',
      options: [
        { value: 'weightlifting', label: 'Weightlifting', image: '/placeholder.svg?height=100&width=100' },
        { value: 'cardio', label: 'Cardio', image: '/placeholder.svg?height=100&width=100' },
        { value: 'yoga', label: 'Yoga', image: '/placeholder.svg?height=100&width=100' },
        { value: 'hiit', label: 'HIIT', image: '/placeholder.svg?height=100&width=100' },
        { value: 'swimming', label: 'Swimming', image: '/placeholder.svg?height=100&width=100' },
        { value: 'cycling', label: 'Cycling', image: '/placeholder.svg?height=100&width=100' },
      ],
    },
  ]

  const currentQuestion = questions[page]

  const handleNext = () => {
    if (page < questions.length - 1) {
      setPage(page + 1)
    } else {
      console.log('Profile completed:', profile)
      // Here you would typically send the profile data to your backend
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Your Fitness Profile</h1>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
          {currentQuestion.type === 'input' ? (
            <div>
              <Label htmlFor={currentQuestion.field}>{currentQuestion.question}</Label>
              <Input
                id={currentQuestion.field}
                type={currentQuestion.inputType || 'text'}
                placeholder={currentQuestion.placeholder}
                value={profile[currentQuestion.field]}
                onChange={(e) => updateProfile(currentQuestion.field, e.target.value)}
              />
            </div>
          ) : (
            <RadioGroup
              value={profile[currentQuestion.field]}
              onChange={(value) => updateProfile(currentQuestion.field, value)}
            >
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex flex-col items-center">
                    <RadioGroupItem
                      id={option.value}
                      name={currentQuestion.field}
                      value={option.value}
                      checked={profile[currentQuestion.field] === option.value}
                      onChange={() => updateProfile(currentQuestion.field, option.value)}
                    />
                    <Label htmlFor={option.value} className="flex flex-col items-center space-y-2 cursor-pointer">
                      <img
                        src={option.image}
                        alt={option.label}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>
        <div className="mt-6 flex justify-between items-center">
          <Button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
            Previous
          </Button>
          <span>{page + 1} of {questions.length}</span>
          <Button onClick={handleNext}>
            {page === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}