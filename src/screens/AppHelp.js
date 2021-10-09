import React, { useCallback } from "react";
import { Linking } from "react-native";
import {
  Button,
  Icon,
  ButtonGroup,
  Layout,
  Text,
  Card,
} from "@ui-kitten/components";

function AppHelp(props) {
  const handleFBPress = useCallback(async () => {
    await Linking.openURL("https://www.facebook.com/ciphernpc/");
  }, []);
  const handleGooglePress = useCallback(async () => {
    await Linking.openURL("mailto: kushenthimira@gmail.com");
  }, []);
  const handleTwitterPress = useCallback(async () => {
    await Linking.openURL("https://twitter.com/kushenthimira");
  }, []);
  const handleGHPress = useCallback(async () => {
    await Linking.openURL("https://github.com/kushenthimira/posify/releases");
  }, []);
  const FacebookIcon = (props) => <Icon {...props} name="facebook-outline" />;
  const GoogleIcon = (props) => <Icon {...props} name="google-outline" />;
  const TwitterIcon = (props) => <Icon {...props} name="twitter-outline" />;
  const GithubIcon = (props) => <Icon {...props} name="github-outline" />;

  return (
    <Layout style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Card status="basic" style={{ margin: "2%" }} disabled>
        <ButtonGroup style={{ alignSelf: "center" }} appearance="ghost">
          <Button accessoryLeft={FacebookIcon} onPress={handleFBPress} />
          <Button accessoryLeft={TwitterIcon} onPress={handleTwitterPress} />
          <Button accessoryLeft={GoogleIcon} onPress={handleGooglePress} />
        </ButtonGroup>
        <Text category="label" style={{ textAlign: "center" }}>
          Contact Us via Social Media
        </Text>
      </Card>
      <Card status="basic" style={{ margin: "2%" }} onPress={handleGHPress}>
        <ButtonGroup style={{ alignSelf: "center" }} appearance="ghost">
          <Button accessoryLeft={GithubIcon} onPress={handleGHPress} />
        </ButtonGroup>
        <Text style={{ textAlign: "center" }} category="label">
          Visit our GitHub page for Release Details
        </Text>
      </Card>
    </Layout>
  );
}

export default AppHelp;
