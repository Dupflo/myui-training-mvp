"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react"
import { useState } from "react"
import CountdownTimer from "./countdown-timer"
import CustomButton from "./custom-button"
import ImageLightbox from "./image-lightbox"

interface Block {
  id: string
  type: string
  has_children?: boolean
  children?: Block[]
  [key: string]: any
}

interface RenderBlocksProps {
  blocks: Block[]
}

export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks }) => {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  )

  if (!blocks || blocks.length === 0) return null

  // Function to parse shortcodes in text content
  const parseShortcodes = (content: string) => {
    // Array to hold all elements (text and components)
    const elements: React.ReactNode[] = []

    // Current position in the string
    let currentPosition = 0

    // Find all shortcodes
    const shortcodeRegex = /\[(button|counter) ([^\]]+)\]/g
    let match

    while ((match = shortcodeRegex.exec(content)) !== null) {
      // Add text before the shortcode
      if (match.index > currentPosition) {
        elements.push(content.substring(currentPosition, match.index))
      }

      // Extract shortcode type and attributes
      const [fullMatch, shortcodeType, attributesString] = match

      // Parse attributes
      const attributes: Record<string, string> = {}
      const attrRegex = /(\w+)="([^"]+)"/g
      let attrMatch

      while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
        attributes[attrMatch[1]] = attrMatch[2]
      }

      console.log(attributes)

      // Add the appropriate component based on shortcode type
      if (shortcodeType === "button") {
        const buttonText = attributes.name || "Click"
        const buttonLink = attributes.link
        const buttonWidth = (attributes.width || "auto") as "auto" | "full"
        const buttonVariant = (attributes.variant || "primary") as
          | "primary"
          | "secondary"
          | "outline"
          | "ghost"
        const buttonSize = (attributes.size || "md") as "sm" | "md" | "lg"
        const buttonColor = attributes.color

        elements.push(
          <CustomButton
            key={`button-${match.index}`}
            text={buttonText}
            width={buttonWidth}
            link={buttonLink}
            variant={buttonVariant}
            size={buttonSize}
            color={buttonColor}
          />
        )
      } else if (shortcodeType === "counter") {
        const startDate = attributes.start
        const endDate = attributes.end

        if (startDate && endDate) {
          elements.push(
            <CountdownTimer
              key={`counter-${match.index}`}
              startDate={startDate}
              endDate={endDate}
            />
          )
        }
      }

      // Update current position
      currentPosition = match.index + fullMatch.length
    }

    // Add remaining text
    if (currentPosition < content.length) {
      elements.push(content.substring(currentPosition))
    }

    return elements
  }

  return (
    <>
      {lightbox && (
        <ImageLightbox
          src={lightbox.src || "/placeholder.svg"}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}

      {blocks.map((block) => {
        const { type, id } = block

        switch (type) {
          case "divider":
            return <hr className="w-full border" key={id} />

          case "paragraph":
            // Check if paragraph contains shortcodes
            const paragraphText = block.paragraph.rich_text
              .map((rt: any) => rt.plain_text)
              .join("")
            if (
              paragraphText.includes("[button") ||
              paragraphText.includes("[counter")
            ) {
              return <p key={id}>{parseShortcodes(paragraphText)}</p>
            }
            return <Text text={block.paragraph.rich_text} id={id} key={id} />

          case "heading_1":
          case "heading_2":
          case "heading_3":
            // Check if heading contains shortcodes
            const headingText = block[type].rich_text
              .map((rt: any) => rt.plain_text)
              .join("")
            if (
              headingText.includes("[button") ||
              headingText.includes("[counter")
            ) {
              const HeadingTag =
                type === "heading_1" ? "h1" : type === "heading_2" ? "h2" : "h3"
              const classes = {
                heading_1:
                  "my-2 text-3xl font-bold tracking-tight text-black md:text-5xl",
                heading_2:
                  "my-2 text-2xl font-bold tracking-tight text-black md:text-3xl",
                heading_3:
                  "my-2 text-lg font-bold tracking-tight text-black md:text-xl",
              }[type]

              return (
                <HeadingTag key={id} className={classes}>
                  {parseShortcodes(headingText)}
                </HeadingTag>
              )
            }
            return (
              <Heading
                text={block[type].rich_text}
                id={id}
                level={type}
                key={id}
              />
            )

          case "quote":
            return (
              <blockquote key={id} className="border-l-2 border-l-black pl-4">
                <SpanText id={id} text={block.quote.rich_text} />
              </blockquote>
            )

          case "bulleted_list_item":
          case "numbered_list_item":
            return <ListItem key={id} value={block[type]} id={id} />

          case "to_do":
            return <ToDo key={id} value={block.to_do} id={id} />

          case "toggle":
            return <Toggle key={id} value={block.toggle} block={block} />

          case "image":
            const image = block.image
            const imageSrc =
              image.type === "external" ? image.external.url : image.file.url
            const caption = image.caption?.length
              ? image.caption[0].plain_text
              : ""
            return (
              <figure className="my-3 w-full " key={id}>
                <img
                  alt={caption}
                  src={imageSrc || "/placeholder.svg"}
                  className="cursor-pointer w-full max-h-[85vh] shadow-lg rounded-lg  object-cover hover:opacity-90 transition-opacity"
                  onClick={() =>
                    setLightbox({
                      src: imageSrc || "/placeholder.svg",
                      alt: caption,
                    })
                  }
                />
                {caption && (
                  <figcaption className="mt-5"> {caption} </figcaption>
                )}
              </figure>
            )

          case "column_list":
            return <ColumnList key={id} block={block} />

          case "column":
            // Render children of a column
            return block.children ? (
              <RenderBlocks blocks={block.children} />
            ) : null

          case "code":
            // Get the code text
            const codeText = block.code.rich_text
              .map((rt: any) => rt.plain_text)
              .join("")

            // Counter pattern
            const counterMatch = codeText.match(
              /\[counter start="([^"]+)" end="([^"]+)"\]/
            )
            if (counterMatch) {
              const startDate = counterMatch[1]
              const endDate = counterMatch[2]
              return (
                <CountdownTimer
                  key={id}
                  startDate={startDate}
                  endDate={endDate}
                />
              )
            }

            // Button pattern - using name instead of text
            const buttonMatch = codeText.match(
              /\[button name="([^"]+)"(?: link="([^"]+)")?(?: variant="([^"]+)")?(?: size="([^"]+)")?(?: color="([^"]+)")?(?: width="([^"]+)")?\]/
            )
            if (buttonMatch) {
              const buttonText = buttonMatch[1]
              const buttonLink = buttonMatch[2] || undefined
              const buttonVariant = (buttonMatch[3] || "primary") as
                | "primary"
                | "secondary"
                | "outline"
                | "ghost"
              const buttonSize = (buttonMatch[4] || "md") as "sm" | "md" | "lg"
              const buttonColor = buttonMatch[5] || undefined
              const buttonWidth = buttonMatch[6] || undefined

              return (
                <CustomButton
                  text={buttonText}
                  link={buttonLink}
                  variant={buttonVariant}
                  size={buttonSize}
                  width={buttonWidth}
                  color={buttonColor}
                />
              )
            }

            // Regular code block
            return (
              <pre
                key={id}
                className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4"
              >
                <code className="text-sm font-mono">
                  {block.code.rich_text.map((rt: any, i: number) => (
                    <span key={i}>{rt.plain_text}</span>
                  ))}
                </code>
                {block.code.caption.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    {block.code.caption[0].plain_text}
                  </div>
                )}
              </pre>
            )

          default:
            return <div key={id}>{`Unsupported block (${type})`}</div>
        }
      })}
    </>
  )
}

// Updated ColumnList component to handle the correct Notion API structure
const ColumnList: React.FC<{ block: Block }> = ({ block }) => {
  if (!block.children) return null

  return (
    <div className="flex flex-col gap-10 md:flex-row">
      {block.children.map((column) => (
        <div key={column.id} className="flex-1">
          {column.children && <RenderBlocks blocks={column.children} />}
        </div>
      ))}
    </div>
  )
}

const SpanText: React.FC<{ text: any[]; id?: string }> = ({ text, id }) => {
  if (!text) return null

  return (
    <>
      {text.map((value, i) => {
        const { annotations, text } = value
        return (
          <span
            key={`${id}-${i}`}
            className={[
              annotations.bold ? "font-bold" : "",
              annotations.code
                ? "bg-gray-100 p-1 font-mono text-sm rounded-md"
                : "",
              annotations.italic ? "italic" : "",
              annotations.strikethrough ? "line-through" : "",
              annotations.underline ? "underline" : "",
            ].join(" ")}
            style={
              annotations.color !== "default"
                ? { color: annotations.color }
                : {}
            }
          >
            {text.link ? (
              <a href={text.link.url} className="underline">
                {text.content}
              </a>
            ) : (
              text.content
            )}
          </span>
        )
      })}
    </>
  )
}

const Text: React.FC<{ text: any[]; id: string }> = ({ text, id }) => (
  <p>
    <SpanText text={text} id={id} />
  </p>
)

const ListItem: React.FC<{ value: any; id: string }> = ({ value, id }) => (
  <li>
    <SpanText text={value.rich_text} id={id} />
  </li>
)

const Heading: React.FC<{ text: any[]; id: string; level: string }> = ({
  text,
  id,
  level,
}) => {
  const HeadingTag =
    level === "heading_1" ? "h1" : level === "heading_2" ? "h2" : "h3"
  const classes = {
    heading_1: "my-2 text-3xl font-bold tracking-tight text-black md:text-5xl",
    heading_2: "my-2 text-2xl font-bold tracking-tight text-black md:text-3xl",
    heading_3: "my-2 text-lg font-bold tracking-tight text-black md:text-xl",
  }[level]

  return (
    <HeadingTag className={classes}>
      <SpanText text={text} id={id} />
    </HeadingTag>
  )
}

const ToDo: React.FC<{ id: string; value: any }> = ({ id, value }) => (
  <div>
    <label htmlFor={id}>
      <input type="checkbox" id={id} defaultChecked={value.checked} />
      <SpanText text={value.rich_text} />
    </label>
  </div>
)

const Toggle: React.FC<{ value: any; block: Block }> = ({ value, block }) => (
  <details>
    <summary className="cursor-pointer">
      <SpanText text={value.rich_text} />
    </summary>
    <div className="pl-4 mt-2">
      {block.children && <RenderBlocks blocks={block.children} />}
    </div>
  </details>
)
