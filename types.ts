
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface Laureate {
  name: string;
  image: string; // placeholder url
  role: string;
  desc: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  link: string;
  features: string[];
}

export interface Paper {
  id: string;
  title: string;
  subtitle: string;
  link: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  link: string;
}
