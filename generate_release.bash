#!/usr/bin/env bash

command -v zenity >/dev/null 2>&1 || { echo >&2 "Release Generator requires zenity. Aborting."; exit 1; }

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
    a=( ${CURRENT_VERSION//./ } )
    O=${a[0]}
    O=$((O+1))
    NEW_VERSION="$O.0.0"
}

DO_MINOR ()
{
    a=( ${CURRENT_VERSION//./ } )
    O=${a[1]}
    O=$((O+1))
    NEW_VERSION="${a[0]}.$O.0"
}

DO_PATCH ()
{
    a=( ${CURRENT_VERSION//./ } )
    O=${a[2]}
    O=$((O+1))
    NEW_VERSION="${a[0]}.${a[1]}.$O"
}

START_GIT_FLOW ()
{
    echo "Rebasing Develop"
    git checkout develop -q
    git pull origin develop --rebase -q
    echo "Force Checking Out Master"
    git fetch -q
    git checkout master -q
    git reset --hard origin/master -q
    git checkout develop -q
    echo "Starting Git Flow Release"
    git flow release start $NEW_VERSION
}

WRITE_NEW_VERSION ()
{
    perl -pi -e "s/\*\*([0-9]+\.){2}[0-9]+\*\*/**$NEW_VERSION**/g" README.md
    echo "var i = require('./package.json'); i.version = '$NEW_VERSION'; require('fs').writeFileSync('package.json', JSON.stringify(i, null, 2), 'utf8');" | node
}

END_GIT_FLOW ()
{
    export GIT_MERGE_AUTOEDIT=no
    git add -A
    git commit -am "Version Bump for $NEW_VERSION"
    git flow release finish -m "Release $NEW_VERSION" $NEW_VERSION
    echo "Pushing to origin"
    git push origin develop -q
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
