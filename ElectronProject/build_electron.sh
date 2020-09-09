#!/bin/bash
build_type=""
echo "$1"
if [ ! "$1" ]
then
    echo "please input mode arg"
else
    echo "build mode: $1"
    if [ -d "build" ]; then
        echo "remove build folder"
        rm -rf "build"
    fi
    echo "create build folder"
    mkdir "build"
    echo "copy build_html"
    cp -r "build_html" "build/"
    echo "copy electron.js"
    cp "main.js" "build/electron.js"
    echo "copy preload.js"
    cp "preload.js" "build/"
    echo "copy src"
    cp -r "src" "build/"
    src2react_list=$(find src2react -path "*electron.js")
    echo "create icons folder"
    mkdir "build/icons"

    if [ "$1" == "win" ]
    then
        echo "copy src2react"
        # cp -r "src_electron2react" "build/"
        for file in $src2react_list
        do
            # echo "$file"
            cp --parents "$file" "build/"
        done
        echo "copy logo.ico"
        cp "win_build/logo.ico" "build/icons/logo.ico"
        echo "start build"
        npm run build-win
    elif [ "$1" == "mac" ]
    then
        echo "copy src2react"
        for file in $src2react_list
        do
            # echo "$file"
            ditto "$file" "build/$file"
        done
    else
        echo "invalid build mode"
    fi
fi
