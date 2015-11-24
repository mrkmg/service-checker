#!/usr/bin/env bash

set -e

CHECK_IF_CLEAN ()
{
    if [[ -n $(git status --porcelain) ]]; then
        echo "Working Directory is not clean"
        exit 1
    fi
}

GET_CURRENT_VERSION ()
{
    CURRENT_VERSION=`cat "README.md" | grep 'Current Version: ' | sed 's/[^0-9\.]//g'`
}

DO_MAJOR ()
{
    NEW_VERSION=`increment_version.sh -M $CURRENT_VERSION`
}

DO_MINOR ()
{
    NEW_VERSION=`increment_version.sh -m $CURRENT_VERSION`
}

DO_PATCH ()
{
    NEW_VERSION=`increment_version.sh -p $CURRENT_VERSION`
}

START_GIT_FLOW ()
{
    echo "Bring Master Up to date"
    git checkout -B master origin/master
    git flow release start $NEW_VERSION
}

WRITE_NEW_VERSION ()
{
    perl -pi -e "s/\*\*([0-9]+\.){2}[0-9]+\*\*/**$NEW_VERSION**/g" README.md
}

END_GIT_FLOW ()
{
    export GIT_MERGE_AUTOEDIT=no
    git add -A
    git commit -am "Version Bump and Asset Generation for $NEW_VERSION"
    git flow release finish -F -m "Release $NEW_VERSION" $NEW_VERSION
    echo "Pushing to origin"
    git push origin master -q
    git push origin --tags -q
}

GET_TYPE ()
{
    TYPE=$(zenity --entry --title="Release Type" --text="Choose a release type" --entry-text="patch" minor major 2>/dev/null)
}

CONFIRM_UPDATE ()
{
    zenity --question --text="Update from $CURRENT_VERSION to $NEW_VERSION" 2>/dev/null
    if [ $? -gt "0" ]; then
        exit $?
    fi
}

FIFO=$(mktemp)
tail -f $FIFO | zenity --title "Release Generation" --text-info --auto-scroll &
ZEN_PID=$!

trap "sleep 3; kill $ZEN_PID; rm -f $FIFO" EXIT

(
    CHECK_IF_CLEAN

    GET_CURRENT_VERSION
    echo "Current version is: $CURRENT_VERSION"

    GET_TYPE

    case $TYPE in
    "major")
        DO_MAJOR
        ;;
    "minor")
        DO_MINOR
        ;;
    "patch")
        DO_PATCH
        ;;
    *)
        echo "Unknown Type"
        return
        ;;
        esac

    CONFIRM_UPDATE

    echo "Starting"
    START_GIT_FLOW
    WRITE_NEW_VERSION
    END_GIT_FLOW
    echo "Completed release to $NEW_VERSION"
    exit 0
) >$FIFO
