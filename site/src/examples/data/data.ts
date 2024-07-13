export interface DataItem {
  text: string
  i: number
}

export type Data = Record<string, DataItem[]>

export const data: Data = {
  'TO DO': [
    {
      text: 'Create content calendar for the next month.',
      i: 0
    },
    {
      text: 'Develop a comprehensive project plan with milestones and deadlines',
      i: 1
    },
    {
      text: 'Conceptualize and create several logo design options for the rebranding project.',
      i: 2
    },
    {
      text: 'Design the user interface for the login screen.',
      i: 3
    },
    {
      text: 'Conduct a thorough analysis of the top five competitors in the industry.',
      i: 4
    },
    {
      text: 'Import contact list from the latest marketing campaign.',
      i: 5
    },
    {
      text: 'Write unit tests for the payment module.',
      i: 6
    },
    {
      text: 'Outline a marketing strategy that targets our key demographics.',
      i: 7
    }
  ],
  DRAFTING: [
    {
      text: 'Send introductory emails to new leads.',
      i: 8
    },
    {
      text: 'Refresh the content on the homepage and product pages with the latest information.',
      i: 9
    },
    {
      text: 'Develop and integrate new features into the existing mobile app.',
      i: 10
    },
    {
      text: 'Implement authentication system.',
      i: 11
    },
    {
      text: 'Conduct user testing sessions to gather feedback on the beta version of the app.',
      i: 12
    },
    {
      text: 'Write a detailed training manual for new employees.',
      i: 13
    }
  ],
  'IN REVIEW': [
    {
      text: 'Perform a code review for the latest software update to ensure it meets quality standards.',
      i: 14
    },
    {
      text: 'Check the upcoming blog posts for grammatical errors and factual accuracy.',
      i: 15
    },
    {
      text: 'Collect and evaluate feedback on the new logo designs from the design team.',
      i: 16
    },
    {
      text: 'Gather requirements for new features',
      i: 17
    },
    {
      text: 'Fix critical bugs reported by users.',
      i: 18
    },
    {
      text: 'Review and interpret the results from the recent customer satisfaction survey.',
      i: 19
    }
  ],
  DONE: [
    {
      text: 'Successfully launched a new social media campaign across all platforms.',
      i: 20
    },
    {
      text: 'Merge feature branch into the main branch.',
      i: 21
    },
    {
      text: 'Finalized the financial report for the last quarter and presented it to stakeholders.',
      i: 22
    },
    {
      text: 'Brainstorm social media content ideas.',
      i: 23
    },
    {
      text: 'Installed and configured the new Customer Relationship Management (CRM) system.',
      i: 24
    },
    {
      text: 'Check code for performance optimizations.',
      i: 25
    },
    {
      text: 'Organized and conducted a successful webinar on the latest industry trends.',
      i: 26
    },
    {
      text: 'Update CRM with contract details and next steps.',
      i: 27
    }
  ],
  BACKLOG: [
    {
      text: 'Design promotional materials for the upcoming event.',
      i: 28
    },
    {
      text: 'Shoot and edit promotional video.',
      i: 29
    },
    {
      text: 'Get feedback on ad copy from the legal team',
      i: 30
    },
    {
      text: 'Proofread the final version of the newsletter.',
      i: 31
    },
    {
      text: 'Launch new website banner.',
      i: 32
    },
    {
      text: 'Publish Instagram stories and posts.',
      i: 33
    }
  ],
  IDEAS: [
    {
      text: 'Define event goals and objectives.',
      i: 34
    },
    {
      text: 'Research potential venues.',
      i: 35
    },
    {
      text: 'Draft and send proposals to qualified leads.',
      i: 36
    },
    {
      text: 'Secure venue booking.',
      i: 37
    },
    {
      text: 'Contact caterers for menu options.',
      i: 38
    },
    {
      text: 'Double-check all logistical arrangements.',
      i: 39
    },
    {
      text: 'Create a script for the upcoming podcast episode.',
      i: 40
    }
  ]
}
