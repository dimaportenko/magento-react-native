/**
 * Created by Dima Portenko on 28.08.2021
 */
import React from 'react';
import { View } from 'react-native';

interface SpacerProps {
  size: number;
}

export const Spacer = ({ size }: SpacerProps) => (
  <View style={{ height: size, width: size }} />
);
