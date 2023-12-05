import React from 'react';
import { useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import FastImage, { FastImageProps, Priority } from 'react-native-fast-image';
import tw from '../../utils.js/tw';


export interface StyledImageProps extends Omit<FastImageProps, 'source'> {
    /**
     * Image Url to be displayed
     */
    url: string;
    priority?: Priority;
    placeHolderUrl?: string;
    onPress?: () => void;
}

const StyledImage = ({
    url,
    priority,
    placeHolderUrl,
    style,
    onPress,
    ...props
}: StyledImageProps): JSX.Element => {
    const [imageLoaded, setLoaded] = useState(false);
    const loadedEvent = () => setLoaded(true);

    props.accessibilityRole = 'image';
    props.accessible = true;

    let image = null;

    if (placeHolderUrl)
        image = (
            <>
                <FastImage
                    source={{ uri: url, priority }}
                    style={[
                        tw.style(
                            style as any,
                            !imageLoaded && {
                                position: 'absolute',
                                visible: false,
                            }
                        ),
                    ]}
                    onLoadEnd={loadedEvent}
                    {...props}
                />
                <FastImage
                    source={{ uri: placeHolderUrl }}
                    style={tw.style({ hidden: imageLoaded }, style as any)}
                    {...props}
                />
            </>
        );
    else image = <FastImage source={{ uri: url, priority }} style={style} {...props} />;

    if (onPress)
        return (
            <TouchableWithoutFeedback onPress={() => onPress()}>{image}</TouchableWithoutFeedback>
        );

    return image;
};

StyledImage.preload = FastImage.preload;

export default StyledImage;
