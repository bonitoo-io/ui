// Libraries
import React, {FunctionComponent} from 'react'

// Components
import {Context, IconFont} from 'src/clockface'
import {ComponentColor} from '@influxdata/clockface'

interface Props {
  onDelete: () => void
  onClone: () => void
  onView: () => void
  onEditTask: () => void
}

const RuleCardContext: FunctionComponent<Props> = ({
  onDelete,
  onClone,
  onView,
  onEditTask,
}) => {
  return (
    <Context>
      <Context.Menu icon={IconFont.CogThick} testID="context-history-menu">
        <Context.Item
          label="View History"
          action={onView}
          testID="context-history-task"
        />
        <Context.Item
          label="Edit Task"
          action={onEditTask}
          testID="context-edit-task"
        />
      </Context.Menu>
      <Context.Menu
        icon={IconFont.Duplicate}
        color={ComponentColor.Secondary}
        testID="context-clone-menu"
      >
        <Context.Item
          label="Clone"
          action={onClone}
          testID="context-clone-task"
        />
      </Context.Menu>
      <Context.Menu
        icon={IconFont.Trash}
        color={ComponentColor.Danger}
        testID="context-delete-menu"
      >
        <Context.Item
          label="Delete"
          action={onDelete}
          testID="context-delete-task"
        />
      </Context.Menu>
    </Context>
  )
}

export default RuleCardContext
