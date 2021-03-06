// Libraries
import React, {PureComponent} from 'react'
import {connect, ConnectedProps} from 'react-redux'

// Components
import {
  SlideToggle,
  InputLabel,
  ComponentSize,
  FlexBox,
  FlexDirection,
  JustifyContent,
} from '@influxdata/clockface'
import NoteEditorText from 'src/dashboards/components/NoteEditorText'
import NoteEditorPreview from 'src/dashboards/components/NoteEditorPreview'

// Actions
import {
  setIsPreviewing,
  toggleShowNoteWhenEmpty,
  setNote,
} from 'src/dashboards/actions/notes'

// Types
import {AppState, NoteEditorMode} from 'src/types'

type ReduxProps = ConnectedProps<typeof connector>
type Props = ReduxProps

interface State {
  scrollTop: number
}

class NoteEditor extends PureComponent<Props, State> {
  public render() {
    const {note, onSetNote} = this.props

    return (
      <div className="note-editor">
        <div className="note-editor--controls">
          <div className="note-editor--helper">
            Need help using Markdown? Check out{' '}
            <a
              href="https://www.markdownguide.org/cheat-sheet"
              target="_blank"
              rel="noreferrer"
            >
              this handy guide
            </a>
          </div>
          {this.visibilityToggle}
        </div>
        <div className="note-editor--body">
          <NoteEditorText note={note} onChangeNote={onSetNote} />
          <NoteEditorPreview note={note} />
        </div>
      </div>
    )
  }

  private get visibilityToggle(): JSX.Element {
    const {hasQuery, showNoteWhenEmpty, onToggleShowNoteWhenEmpty} = this.props

    if (!hasQuery) {
      return null
    }

    return (
      <FlexBox
        direction={FlexDirection.Row}
        justifyContent={JustifyContent.FlexEnd}
      >
        <InputLabel>Show note when query returns no data</InputLabel>
        <SlideToggle
          active={showNoteWhenEmpty}
          size={ComponentSize.ExtraSmall}
          onChange={onToggleShowNoteWhenEmpty}
        />
      </FlexBox>
    )
  }
}

const mstp = (state: AppState) => {
  const {note, mode, viewID, isPreviewing, showNoteWhenEmpty} = state.noteEditor
  const hasQuery =
    mode === NoteEditorMode.Editing &&
    viewID &&
    state.resources.views.byID[viewID] &&
    state.resources.views.byID[viewID].properties.type !== 'markdown'

  return {note, hasQuery, isPreviewing, showNoteWhenEmpty}
}

const mdtp = {
  onSetIsPreviewing: setIsPreviewing,
  onToggleShowNoteWhenEmpty: toggleShowNoteWhenEmpty,
  onSetNote: setNote,
}

const connector = connect(mstp, mdtp)

export default connector(NoteEditor)
