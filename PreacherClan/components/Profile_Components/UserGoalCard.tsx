import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { useState, useEffect, useRef } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'

interface Props {
  fitnessGoals: string[]
  exerciseGenre: string[]
  timings ? :string 
  onUpdateFitnessGoals?: (goals: string[]) => void
  onUpdateExerciseGenre?: (genres: string[]) => void
  onTimingChange?: (timing: string) => void
  onEditStart?: () => void
}
function parseTiming(timing?: string) {
  if (!timing) return null

  // Custom format: "Evening 12:35–13:30"
  const customMatch = timing.match(
    /^(Morning|Evening)\s+(\d{1,2}:\d{2})–(\d{1,2}:\d{2})$/
  )

  if (customMatch) {
    return {
      type: 'custom' as const,
      period: customMatch[1] as 'Morning' | 'Evening',
      start: customMatch[2],
      end: customMatch[3],
    }
  }

  // Preset format: "Morning 8–10"
  return {
    type: 'preset' as const,
    slot: timing,
  }
}

export default function UserGoalCard({
  fitnessGoals,
  exerciseGenre,
  onUpdateFitnessGoals,
  onUpdateExerciseGenre,
  onTimingChange,
  onEditStart,
  timings
}: Props) {
  const [editing, setEditing] = useState(false)

  /* -------- GOALS -------- */
  const [goals, setGoals] = useState<string[]>(fitnessGoals)
  const [goalInput, setGoalInput] = useState('')

  useEffect(() => {
    setGoals(fitnessGoals ?? [])
  }, [fitnessGoals])

  /* -------- TIMINGS -------- */
  const [preferredSlot, setPreferredSlot] = useState<string>('Morning 5–7')
const [customPeriod, setCustomPeriod] =
  useState<'Morning' | 'Evening'>('Morning')
const [startTime, setStartTime] = useState(new Date())
const [endTime, setEndTime] = useState(new Date())

  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)

  const formatTime = (d: Date) =>
    `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`

  const finalTiming =
    preferredSlot !== 'Other'
      ? preferredSlot
      : `${customPeriod} ${formatTime(startTime)}–${formatTime(endTime)}`

  /* -------- ANIMATIONS -------- */
  const anims = useRef<Animated.Value[]>([]).current


  const onStartTimeChange = (_: any, selected?: Date) => {
  setShowStartPicker(false)
  if (selected) setStartTime(selected)
}

const onEndTimeChange = (_: any, selected?: Date) => {
  setShowEndPicker(false)
  if (selected) setEndTime(selected)
}


useEffect(() => {
  const parsed = parseTiming(timings)
  if (!parsed) return

  if (parsed.type === 'preset') {
    setPreferredSlot(parsed.slot)
  }

  if (parsed.type === 'custom') {
    setPreferredSlot('Other')
    setCustomPeriod(parsed.period)

    const [sh, sm] = parsed.start.split(':').map(Number)
    const [eh, em] = parsed.end.split(':').map(Number)

    const start = new Date()
    start.setHours(sh, sm, 0)

    const end = new Date()
    end.setHours(eh, em, 0)

    setStartTime(start)
    setEndTime(end)
  }
}, [timings])


  // Keep anim array in sync
  useEffect(() => {
    goals.forEach((_, i) => {
      if (!anims[i]) anims[i] = new Animated.Value(1)
    })
    anims.splice(goals.length)
  }, [goals])

  /* REMOVE WITH SHRINK */
  const removeGoal = (index: number) => {
    Animated.timing(anims[index], {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setGoals(prev => prev.filter((_, i) => i !== index))
    })
  }

  /* ADD WITH BOUNCE */
  const addGoal = () => {
    const value = goalInput.trim()
    if (!value) return

    if (goals.find(g => g.toLowerCase() === value.toLowerCase())) {
      setGoalInput('')
      return
    }

    setGoals(prev => {
      const next = [...prev, value]

      // create bounce animation for this tag
      const index = next.length - 1
      anims[index] = new Animated.Value(0.2)

      Animated.spring(anims[index], {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 120,
      }).start()

      return next
    })

    setGoalInput('')
  }

  /* SAVE */
  const handleDone = () => {
    setEditing(false)
    onUpdateFitnessGoals?.(goals)
    onTimingChange?.(finalTiming)
    onEditStart?.()
  }

  return (
    <View className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
      {/* Header */}
      <View className="flex-row justify-between mb-3">
        <Text className="text-white text-md font-semibold font-bartle">
          Fitness Goals
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (!editing) onEditStart?.()
            setEditing(!editing)
          }}
        >
          <Text className="text-blue-400 text-sm">
            {editing ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Goals */}
      <View className="flex-row flex-wrap gap-2 mb-3">
        {goals.map((g, i) => {
          const anim = anims[i] ?? new Animated.Value(1)

          return (
            <Animated.View
              key={i}
              style={{
                opacity: anim,
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1],
                    }),
                  },
                ],
              }}
              className="bg-amber-400 px-3 py-1 rounded-lg flex-row items-center"
            >
              <Text className="text-black text-sm font-ScienceGothic">
                {g}
              </Text>

              {editing && (
                <TouchableOpacity
                  onPress={() => removeGoal(i)}
                  className="ml-2"
                >
                  <Text className="text-black font-bold">×</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )
        })}
      </View>

      {/* Current Timing */}
      <Text className="text-zinc-300 text font-semibold-sm mb-2 font-ScienceGothic">
        Preferred Workout Time
      </Text>

      <View className="mt mb-2 w-full bg-red-600 p-2 rounded-md">
        <Text className="text-black font-semibold font-bartle">
          {finalTiming}
        </Text>
      </View>

      {editing && (
        <>
          {/* Add Goal */}
          <TextInput
            value={goalInput}
            onChangeText={setGoalInput}
            placeholder="Add fitness goal"
            placeholderTextColor="#888"
            className="bg-zinc-900 font-ScienceGothic text-white px-3 py-2 rounded mb-2"
          />

          <TouchableOpacity
            onPress={addGoal}
            className="bg-red-600 rounded py-2 mb-4"
          >
            <Text className="text-white text-center font-ScienceGothic">
              Add Goal
            </Text>
          </TouchableOpacity>

          {/* Timing Options */}
          <Text className="text-zinc-300 text-sm mb-2 font-ScienceGothic">
            Preferred Workout Time
          </Text>

          {['Morning 5–7', 'Morning 8–10', 'Other'].map(slot => (
            <TouchableOpacity
              key={slot}
              onPress={() => setPreferredSlot(slot)}
              className={`px-3 py-2 rounded mb-2 border border-dashed ${
                preferredSlot === slot
                  ? 'border-white'
                  : 'border-zinc-700'
              }`}
            >
              <Text className="text-white text-sm font-ScienceGothic">
                {slot}
              </Text>
            </TouchableOpacity>
          ))}

          {preferredSlot === 'Other' && (
            <View className="mt-3">
              <View className="flex-row gap-3 mb-3">
                {['Morning', 'Evening'].map(p => (
                  <TouchableOpacity
                    key={p}
                    onPress={() =>
                      setCustomPeriod(p as 'Morning' | 'Evening')
                    }
                    className={`px-4 py-2 bg-amber-400 rounded-md border ${
                      customPeriod === p
                        ? 'border-zinc-950'
                        : 'border-zinc-700'
                    }`}
                  >
                    <Text className="text-black font-ScienceGothic">
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                className="bg-zinc-800 px-3 py-2 rounded mb-2"
              >
                <Text className="text-white font-ScienceGothic text-sm">
                  Start: {formatTime(startTime)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                className="bg-zinc-800 px-3 py-2 rounded"
              >
                <Text className="text-white font-ScienceGothic text-sm">
                  End: {formatTime(endTime)}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={handleDone}
            className="mt-4 bg-green-600 py-2 rounded"
          >
            <Text className="text-white text-center font-ScienceGothic">
              Done
            </Text>
          </TouchableOpacity>
        </>
      )}
      {showStartPicker && (
  <DateTimePicker
    value={startTime}
    mode="time"
    is24Hour={false}
    display="default"
    onChange={onStartTimeChange}
  />
)}

{showEndPicker && (
  <DateTimePicker
    value={endTime}
    mode="time"
    is24Hour={false}
    display="default"
    onChange={onEndTimeChange}
  />
)}

    </View>
  )
}
