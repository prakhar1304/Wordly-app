"use client"
import { View, StyleSheet } from "react-native"
import Svg, { Circle, G } from "react-native-svg"

interface ProgressChartProps {
  progress: number // 0 to 1
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
}

export function ProgressChart({
  progress,
  size = 100,
  strokeWidth = 10,
  color = "#e07aff",
  backgroundColor = "rgba(255, 255, 255, 0.1)",
}: ProgressChartProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - progress * circumference

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
})
