export type Color = "default" | "dark" | "light" | "accent" | "good" | "warning" | "attention"

export interface CardData {
  iconUrl: string,
  title: {
    text: string,
    color: Color
  },
  facts: { title: string, value: string }[],
  viewUrl: string
}

export const createCard = ({ iconUrl, title, facts, viewUrl }: CardData) => ({
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.2",
  "body": [
    {
      "type": "ColumnSet",
      "columns": [
        {
          "type": "Column",
          "width": "auto",
          "items": [
            {
              "type": "Image",
              "url": iconUrl,
              "size": "Small",
              "style": "Default"
            }
          ]
        },
        {
          "type": "Column",
          "width": "stretch",
          "items": [
            {
              "type": "TextBlock",
              "text": title.text,
              "wrap": true,
              "height": "stretch",
              "isVisible": true,
              "spacing": "None",
              "fontType": "Default",
              "isSubtle": true,
              "size": "ExtraLarge",
              "weight": "Bolder",
              "color": title.color
            }
          ],
          "verticalContentAlignment": "Center"
        }
      ]
    },
    {
      "type": "FactSet",
      "facts": facts
    }
  ],
  "actions": [
    {
      "type": "Action.OpenUrl",
      "title": "View",
      "url": viewUrl,
      "style": "positive",
      "iconUrl": iconUrl
    }
  ]
});